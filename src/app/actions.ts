'use server';

import fs from 'fs/promises';
import path from 'path';

interface ActionResult {
  success: boolean;
  imageUrl?: string;
  downloadUrl?: string;
  error?: string;
}

export async function generateImageAction(formData: FormData): Promise<ActionResult> {
  const positivePrompt = formData.get('positivePrompt') as string;
  const negativePrompt = formData.get('negativePrompt') as string;
  
  // Baca nilai-nilai baru dari form
  const baseModel = formData.get('baseModel') as string;
  const samplerName = formData.get('sampler_name') as string;
  const steps = formData.get('steps') as string;
  const cfg = formData.get('cfg') as string;
  const width = formData.get('width') as string;
  const height = formData.get('height') as string;


  if (!positivePrompt) {
    return { success: false, error: 'Positive prompt is required.' };
  }
  
  try {
    const workflowPath = path.join(process.cwd(), 'public', 'Animation+HiRes.json');
    const workflowJson = await fs.readFile(workflowPath, 'utf-8');
    const workflow = JSON.parse(workflowJson);

    // Update node berdasarkan ID dengan nilai-nilai baru
    // Checkpoint Loader (Node 4)
    if (workflow.nodes && workflow.nodes['4']) {
      workflow.nodes['4'].inputs.ckpt_name = baseModel;
    }

    // Positive Prompt (Node 6)
    if (workflow.nodes && workflow.nodes['6']) {
      workflow.nodes['6'].inputs.text = positivePrompt;
    }

    // Negative Prompt (Node 7)
    if (workflow.nodes && workflow.nodes['7']) {
      workflow.nodes['7'].inputs.text = negativePrompt;
    }

    // KSampler (Node 3)
    if (workflow.nodes && workflow.nodes['3']) {
      workflow.nodes['3'].inputs.steps = parseInt(steps, 10);
      workflow.nodes['3'].inputs.cfg = parseFloat(cfg);
      workflow.nodes['3'].inputs.sampler_name = samplerName;
    }

    // Empty Latent Image (Node 5)
    if (workflow.nodes && workflow.nodes['5']) {
      workflow.nodes['5'].inputs.width = parseInt(width, 10);
      workflow.nodes['5'].inputs.height = parseInt(height, 10);
    }
    
    // Perlu diubah karena kita akan men-queue prompt
    const promptData = { prompt: workflow.nodes, client_id: `studio_${Date.now()}` };

    const comfyUIUrl = 'http://10.128.129.212:8188/prompt';
    const response = await fetch(comfyUIUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promptData),
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ComfyUI server responded with status: ${response.status}. ${errorText}`);
    }

    const data = await response.json();
    
    if (data.error) {
       return { success: false, error: `ComfyUI Error: ${data.error.type} - ${data.error.message}` };
    }
    
    // Karena ComfyUI bekerja secara async, kita perlu polling hasilnya
    const promptId = data.prompt_id;
    return await getExecutionResult(promptId);

  } catch (err: any) {
    console.error(err);
    if (err.code === 'ECONNREFUSED') {
      return { success: false, error: 'Connection to ComfyUI server failed. Is it running at http://10.128.129.212:8188?' };
    }
    return { success: false, error: err.message || 'An unknown error occurred during image generation.' };
  }
}

async function getExecutionResult(promptId: string): Promise<ActionResult> {
  const historyUrl = `http://10.128.129.212:8188/history/${promptId}`;
  
  for (let i = 0; i < 60; i++) { // Coba selama 60 detik
    await new Promise(resolve => setTimeout(resolve, 1000)); // Tunggu 1 detik
    
    const response = await fetch(historyUrl);
    if (!response.ok) continue;

    const historyData = await response.json();
    const history = historyData[promptId];

    if (history && history.outputs) {
      for (const nodeId in history.outputs) {
        const nodeOutput = history.outputs[nodeId];
        if (nodeOutput.images) {
          const image = nodeOutput.images[0];
          const filename = image.filename;
          const viewUrl = `http://10.128.129.212:8188/view?filename=${filename}&subfolder=${image.subfolder}&type=${image.type}`;
          return { success: true, imageUrl: viewUrl, downloadUrl: viewUrl };
        }
      }
    }
  }

  return { success: false, error: 'Image generation timed out. Could not retrieve result from ComfyUI.' };
}
