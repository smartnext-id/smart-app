# **App Name**: ComfyCanvas

## Core Features:

- Prompt Input: Text area for users to input positive prompts.
- Negative Prompt Input: Text area for users to input negative prompts to refine image generation.
- Image Generation: Generates an image based on positive and negative prompts, connecting to a local ComfyUI server instance. This feature involves using the LLM as a tool for connecting to the local server, injecting prompts into the JSON workflow and sending the prompt.
- Image Display: Displays the generated image upon successful creation.
- Download Image: Allows users to download the generated image in PNG format.
- Workflow Management: Loads a default ComfyUI workflow from a local JSON file to provide a starting point for image generation.
- Status Updates: Provides real-time feedback on the generation process.

## Style Guidelines:

- Primary color: Midnight blue (#2c3e50) to provide a calm, creative atmosphere.
- Background color: Light gray (#f0f2f5) to maintain focus on the canvas.
- Accent color: Teal (#3498db) for interactive elements and highlights, ensuring they stand out against the background.
- Body and headline font: 'Inter', a sans-serif font, to provide a clean and modern interface. 
- Clean and straightforward layout with clearly defined sections for input, output, and controls.
- Subtle loading animations during image generation.
- Use minimalist icons for actions like 'Download'.