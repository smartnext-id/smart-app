'use client';

import { useState, useTransition } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, Plus, PlusCircle, Settings2, X } from 'lucide-react';

import { generateImageAction } from '@/app/actions';
import { SmartnextCanvas } from '@/components/comfy-canvas';
import { cn } from '@/lib/utils';

const PRESET_COLORS = [
  '#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#4B0082', '#EE82EE',
  '#FFFFFF', '#C0C0C0', '#808080', '#000000', '#A52A2A', '#F5DEB3', '#D2B48C',
];

export function SmartnextID() {
  const [isGenerating, startGenerationTransition] = useTransition();
  const [result, setResult] = useState<{ imageUrl?: string; downloadUrl?: string; error?: string }>({});
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [samplingSteps, setSamplingSteps] = useState(20);
  const [cfgScale, setCfgScale] = useState(7);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [colorPalette, setColorPalette] = useState<string[]>([]);

  const handleColorSelect = (color: string) => {
    setColorPalette((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const removeColor = (color: string) => {
    setColorPalette((prev) => prev.filter((c) => c !== color));
  };


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult({});
    const formData = new FormData(event.currentTarget);
    
    formData.set('steps', samplingSteps.toString());
    formData.set('cfg', cfgScale.toString());
    formData.set('width', width.toString());
    formData.set('height', height.toString());

    startGenerationTransition(async () => {
      const res = await generateImageAction(formData);
      setResult(res);
    });
  };

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="offcanvas">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <SidebarHeader>
             <h1 className="text-xl font-semibold">Generator</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Model</Label>
                     <Select name="baseModel" defaultValue="illustrious_Anime_illstration_illustrious-V2.safetensors" disabled={isGenerating}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="illustrious_Anime_illstration_illustrious-V2.safetensors">Illustrious Anime Illustration V2</SelectItem>
                        <SelectItem value="Disney_Pixar_Cartoon_Type_A_v1.0.safetensors">Disney Pixar Cartoon Type A v1.0</SelectItem>
                        <SelectItem value="2.8D_National_Anime_Goddess_-_SD1.5_V1.0_V1.0.safetensors">2.8D National Anime Goddess</SelectItem>
                        <SelectItem value="AgainMix_2.8D_v1_Mature.safetensors">AgainMix 2.8D v1 Mature</SelectItem>
                        <SelectItem value="Fresh_and_clean_5.0.safetensors">Fresh and clean 5.0</SelectItem>
                        <SelectItem value="Kawaii_3D_big_head_kawaii_3d_2.0.safetensors">Kawaii 3D big head</SelectItem>
                        <SelectItem value="LandscapeBing_v1.0_Glacial_Acetic_Acid_Versatile_Landscape_v1.0_v1.0.safetensors">LandscapeBing v1.0</SelectItem>
                        <SelectItem value="AWportrait_v1.4.safetensors">AWportrait v1.4</SelectItem>
                        <SelectItem value="RealCartoon-Pixar_V10.safetensors">RealCartoon-Pixar V10</SelectItem>
                        <SelectItem value="dreamshaper_8.safetensors">dreamshaper 8</SelectItem>
                        <SelectItem value="3dAnimationDiffusion_v10.safetensors">3dAnimationDiffusion v10</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Styles LoRA</Label>
                    <Select name="lora" disabled={isGenerating} defaultValue="None">
                        <SelectTrigger>
                            <SelectValue placeholder="Select a LoRA" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="maid_attire_v2.safetensors">maid_attire_v2</SelectItem>
                            <SelectItem value="38-DA-Traditional Chinese Style-Pink Theme A 1.0.safetensors">38-DA-Traditional Chinese Style-Pink Theme A 1.0</SelectItem>
                            <SelectItem value="51-DA-Tomb King-Traditional Chinese Style-Spring Festival New Clothes 1.0.safetensors">51-DA-Tomb King-Traditional Chinese Style-Spring Festival New Clothes 1.0</SelectItem>
                            <SelectItem value="Twin-tailed cute girl Twin tails beauty.safetensors">Twin-tailed cute girl Twin tails beauty</SelectItem>
                            <SelectItem value="Hand repair - reject bad hand_1.0.safetensors">Hand repair - reject bad hand_1.0</SelectItem>
                            <SelectItem value="Finger Perfect Repair - Rejecting Ai Hand, Perfect Realistic Finger_0.8_F.1.safetensors">Finger Perfect Repair - Rejecting Ai Hand, Perfect Realistic Finger_0.8_F.1</SelectItem>
                            <SelectItem value="Magic Flying - Clothing - Open-front JK v10.safetensors">Magic Flying - Clothing - Open-front JK v10</SelectItem>
                            <SelectItem value="ABEL UNDERWATER_v1.0.safetensors">ABEL UNDERWATER_v1.0</SelectItem>
                            <SelectItem value="Oily skin_1.0.safetensors">Oily skin_1.0</SelectItem>
                            <SelectItem value="Majic Mix Yutian - Lovely Girl - Yunhan_1.0.safetensors">Majic Mix Yutian - Lovely Girl - Yunhan_1.0</SelectItem>
                            <SelectItem value="PsycoDream_v1.safetensors">PsycoDream_v1</SelectItem>
                            <SelectItem value="IP_3D IP effect model 2.0_3D IP effect model v2.0.safetensors">IP_3D IP effect model 2.0_3D IP effect model v2.0</SelectItem>
                            <SelectItem value="Magic Mix_Black sheer dress_v1.0.safetensors">Magic Mix_Black sheer dress_v1.0</SelectItem>
                            <SelectItem value="Al Avatar Customization_Pixar Style_v1.0.safetensors">Al Avatar Customization_Pixar Style_v1.0</SelectItem>
                            <SelectItem value="Underwear 30_v01_magic mix.safetensors">Underwear 30_v01_magic mix</SelectItem>
                            <SelectItem value="ANIME_AWPAINTING_V1.3_v1.3.safetensors">ANIME_AWPAINTING_V1.3_v1.3</SelectItem>
                            <SelectItem value="UIA Major Upgrade_Architectural Realistic Class 3.0_1.5.safetensors">UIA Major Upgrade_Architectural Realistic Class 3.0_1.5</SelectItem>
                            <SelectItem value="Leosam's Clothing_+_Adjuster Clothing Increase_Decrease LoRa_3.0.safetensors">Leosam's Clothing_+_Adjuster Clothing Increase_Decrease LoRa_3.0</SelectItem>
                            <SelectItem value="Cute little girl in high definition realistic style, No. 158_1.0.safetensors">Cute little girl in high definition realistic style, No. 158_1.0</SelectItem>
                            <SelectItem value="Universal e-commerce scenario_V2.safetensors">Universal e-commerce scenario_V2</SelectItem>
                            <SelectItem value="Magic Mix_asian beauty face model 8_1.safetensors">Magic Mix_asian beauty face model 8_1</SelectItem>
                            <SelectItem value="loraTanngshui_water Splash.safetensors">loraTanngshui_water Splash</SelectItem>
                            <SelectItem value="Lensflare.safetensors">Lensflare</SelectItem>
                            <SelectItem value="Breast Enlargement at Your Fingertips - Body Shape Adjustment_v1.safetensors">Breast Enlargement at Your Fingertips - Body Shape Adjustment_v1</SelectItem>
                            <SelectItem value="Perfect Fingers_SK Excl. V1.1.safetensors">Perfect Fingers_SK Excl. V1.1</SelectItem>
                            <SelectItem value="Concept illustration in a game style model_v1.0.safetensors">Concept illustration in a game style model_v1.0</SelectItem>
                            <SelectItem value="[Peerless Tangmen]Jiang Nannan_v1.0.safetensors">[Peerless Tangmen]Jiang Nannan_v1.0</SelectItem>
                            <SelectItem value="LEGO_LEGO Bricks V1_XL.safetensors">LEGO_LEGO Bricks V1_XL</SelectItem>
                            <SelectItem value="Lego building blocks Lora_LEGO Building Blocks V1.safetensors">Lego building blocks Lora_LEGO Building Blocks V1</SelectItem>
                            <SelectItem value="LEGO World_V1.safetensors">LEGO World_V1</SelectItem>
                            <SelectItem value="Original Custom LEGO (shallow LEGO-ized model) - Ultimate Cute Model_LEGO LoRa model.safetensors">Original Custom LEGO (shallow LEGO-ized model) - Ultimate Cute Model_LEGO LoRa model</SelectItem>
                            <SelectItem value="Clay Word_Clay Filter Style - Everything Can Be Clay v1.0.safetensors">Clay Word_Clay Filter Style - Everything Can Be Clay v1.0</SelectItem>
                            <SelectItem value="Q version character--niji style kawaii_v1.0.safetensors">Q version character--niji style kawaii_v1.0</SelectItem>
                            <SelectItem value="Detail - lkwaker.safetensors">Detail - lkwaker</SelectItem>
                            <SelectItem value="[Logo]text Doodle_logo_V1.0.safetensors">[Logo]text Doodle_logo_V1.0</SelectItem>
                            <SelectItem value="Miniature Diorama FLUX_FLUX.safetensors">Miniature Diorama FLUX_FLUX</SelectItem>
                            <SelectItem value="sd1.5_Car design Car design_1.safetensors">sd1.5_Car design Car design_1</SelectItem>
                            <SelectItem value="3D_2.safetensors">3D_2</SelectItem>
                            <SelectItem value="3D.safetensors">3D</SelectItem>
                            <SelectItem value="L Poseide-2_v1.0.safetensors">L Poseide-2_v1.0</SelectItem>
                            <SelectItem value="Repair Limb Deformities - Super blockbuster wedding photography Lora_ SD1.5_1.0.safetensors">Repair Limb Deformities - Super blockbuster wedding photography Lora_ SD1.5_1.0</SelectItem>
                            <SelectItem value="HandFix Pro - Chuyên Gia Sửa Tay V2_HandFix Pro.safetensors">HandFix Pro - Chuyên Gia Sửa Tay V2_HandFix Pro</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                
                  <div className="space-y-2">
                    <Label htmlFor="positive-prompt">Prompt</Label>
                    <Textarea
                      id="positive-prompt"
                      name="positivePrompt"
                      placeholder="e.g., A majestic lion in a grassy savannah"
                      rows={4}
                      disabled={isGenerating}
                      defaultValue="a vibrant coral reef teeming with life, photorealistic, 4k"
                    />
                  </div>
                  <div className="space-y-2">
                     <Textarea
                      id="negative-prompt"
                      name="negativePrompt"
                      placeholder="Negative prompt..."
                      rows={2}
                      disabled={isGenerating}
                      defaultValue="blurry, cartoonish, low quality"
                    />
                  </div>
                </div>
            </SidebarGroup>
            <Separator />
            <SidebarGroup>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="image-to-image-upload">Image to Image</Label>
                        <Button variant="ghost" size="icon" className="h-6 w-6" disabled={isGenerating}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                     <div className="flex items-center justify-between">
                        <Label htmlFor="image-reference-upload">Image Reference</Label>
                         <Button variant="ghost" size="icon" className="h-6 w-6" disabled={isGenerating}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <Label>Color Palette</Label>
                        <div className="flex items-center gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="icon" className="shrink-0" disabled={isGenerating}>
                                        <PlusCircle className="h-4 w-4" />
                                        <span className="sr-only">Add Color</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto">
                                    <div className="grid grid-cols-7 gap-2">
                                        {PRESET_COLORS.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                className={cn(
                                                    "h-6 w-6 rounded-full border-2",
                                                    colorPalette.includes(color) ? 'border-ring' : 'border-transparent'
                                                )}
                                                style={{ backgroundColor: color }}
                                                onClick={() => handleColorSelect(color)}
                                            />
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <div className="flex flex-wrap gap-2">
                                {colorPalette.map((color) => (
                                    <div key={color} className="relative group">
                                        <div
                                            className="h-6 w-6 rounded-full border"
                                            style={{ backgroundColor: color }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeColor(color)}
                                            className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-muted-foreground text-white flex items-center justify-center opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarGroup>
             <Separator />
             <SidebarGroup>
                <SidebarGroupLabel>Image Size</SidebarGroupLabel>
                <div className="grid grid-cols-2 gap-2">
                    <Input id="width" name="width" type="number" placeholder="Width" value={width} onChange={(e) => setWidth(parseInt(e.target.value, 10) || 0)} disabled={isGenerating}/>
                    <Input id="height" name="height" type="number" placeholder="Height" value={height} onChange={(e) => setHeight(parseInt(e.target.value, 10) || 0)} disabled={isGenerating}/>
                </div>
             </SidebarGroup>
             <Separator />
              <SidebarGroup>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Settings2 />
                        <Label htmlFor="advanced-toggle">Advanced</Label>
                    </div>
                    <Switch id="advanced-toggle" checked={showAdvanced} onCheckedChange={setShowAdvanced} disabled={isGenerating}/>
                </div>
                {showAdvanced && (
                    <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label>Sampler methods</Label>
                            <Select name="sampler_name" defaultValue="dpmpp_2m" disabled={isGenerating}>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a sampler" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="dpmpp_2m">DPM++ 2M</SelectItem>
                                <SelectItem value="euler">Euler</SelectItem>
                                <SelectItem value="dpmpp_sde">DPM++ SDE</SelectItem>
                                <SelectItem value="dpmpp_2m_sde_gpu">DPM++ 2M SDE GPU</SelectItem>
                                <SelectItem value="dpmpp_2s_ancestral">DPM++ 2S Ancestral</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Sampling Steps</Label>
                                <span>{samplingSteps}</span>
                            </div>
                            <Slider
                                name="steps"
                                defaultValue={[20]}
                                value={[samplingSteps]}
                                onValueChange={(value) => setSamplingSteps(value[0])}
                                max={60}
                                min={1}
                                step={1}
                                disabled={isGenerating}
                            />
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between">
                                <Label>CFG Scale</Label>
                                <span>{cfgScale}</span>
                            </div>
                            <Slider
                                name="cfg"
                                defaultValue={[7]}
                                value={[cfgScale]}
                                onValueChange={(value) => setCfgScale(value[0])}
                                max={30}
                                min={1}
                                step={0.5}
                                disabled={isGenerating}
                            />
                        </div>
                    </div>
                )}
             </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <Button type="submit" className="w-full" size="lg" disabled={isGenerating}>
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate
            </Button>
          </SidebarFooter>
        </form>
      </Sidebar>
      <SidebarInset>
        <header className="p-4 border-b shadow-sm sticky top-0 bg-background/80 backdrop-blur-sm z-10 flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold hidden md:block">Smartnext.id</h1>
        </header>
        <SmartnextCanvas isGenerating={isGenerating} result={result} width={width} height={height} />
      </SidebarInset>
    </SidebarProvider>
  );
}
