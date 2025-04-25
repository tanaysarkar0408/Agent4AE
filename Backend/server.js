const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
app.use(cors({ origin: '*', methods: ['POST'], allowedHeaders: ['Content-Type', 'Origin', 'Accept'] }));
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash"
    // systemInstruction : {
    //     role: 'system',
    //   parts: [{"text": `You are an expert in Adobe After Effects scripting. Only return JavaScript ExtendScript code. Do not explain anything, just return the script.`}]
    // }
});

 app.post("/convert", async (req, res) => {
  console.log('Received request:', {
    body: req.body,
    headers: req.headers,
    ip: req.ip,
    timestamp: new Date().toISOString()
});
const { prompt, aeVersion = "After Effects" } = req.body;
if (!prompt) {
    console.log('Error: Prompt missing');
    return res.status(400).json({ error: "Prompt is required" });
}
    try {
      // 🔸 Use system prompt here:
      const chat = model.startChat({
        history: [],
        systemInstruction : {
            role: 'system',
          parts: [{"text": `You are an expert in Adobe After Effects scripting. You can do anything you can trim portions of layers, you can create a new layer,etc. You just need to generate a script for all that.
            Generate only valid JavaScript ExtendScript code for 
            After Effects, wrapped in an immediately invoked function expression (function() { ... })();. 
            Do not include explanations, comments, markdown, or code fences (e.g., \`\`\`javascript).
             Ensure the script is concise, functional, and checks for active composition (e.g., if (app.project.activeItem == null) 
             { alert("No active composition"); return; }).
             Target the selected layer or a specified layer by name/index, checking if a layer exists. Examples:
            - "Create a null layer and make it parent of 8th layer": (function() { if (app.project.activeItem == null || !(app.project.activeItem instanceof CompItem)) { alert("No active composition"); return; } var comp = app.project.activeItem; if (comp.numLayers < 8) { alert("Composition must have at least 8 layers"); return; } var nullLayer = comp.layers.addNull(); var eighthLayer = comp.layer(8); eighthLayer.parent = nullLayer; })();
            - "Create a red solid layer named Background": (function() { if (app.project.activeItem == null) { alert("No active composition"); return; } app.project.activeItem.layers.addSolid([1,0,0], "Background", 1920, 1080, 1); })();
            - "Create an adjustment layer": (function() { if (app.project.activeItem == null) { alert("No active composition"); return; } var adjLayer = app.project.activeItem.layers.addSolid([1,1,1], "Adjustment Layer", app.project.activeItem.width, app.project.activeItem.height, 1); adjLayer.adjustmentLayer = true; })();
              For precompose commands, pass an array of layer indices (integers, e.g., [1, 2, 3]) to layers.precompose. 
              For adjustment layers, create a solid layer with addSolid and set adjustmentLayer = true.
              For adding effects, use layer.Effects.addProperty with the effect's internal name 
              (e.g., "ADBE Gaussian Blur 2" for Gaussian Blur). 
              For applying user presets, use layer.applyPreset with a File object. 
              Presets may be in:
              - User Presets: Folder.myDocuments.fsName + "/Adobe/After Effects ${aeVersion}/User Presets/" with subfolders specified in the prompt (e.g., "Effects/Lo twixtor 1" for "User Presets/Effects/Lo twixtor 1.ffx").
              - Default Presets: "C:/Program Files/Adobe/Adobe After Effects ${aeVersion}/Support Files/Presets/" with subfolders (e.g., "Trapcode Tao/Trapcode Tao.ffx").
              Use the exact preset name from the prompt, preserving spaces and capitalization, and append .ffx only if not included. Check if the preset file exists before applying. Target the selected layer, a named layer, or a newly created layer as specified.
              Map common effect names to internal names:
              - Blur, Gaussian Blur: ADBE Gaussian Blur 2
              - Drop Shadow: ADBE Drop Shadow
              - Hue/Saturation: ADBE Hue Saturation
              Examples:
              - "Create a star shape layer of red color": (function() { if (!app.project.activeItem) { var comp = app.project.items.addComp("New Comp", 500, 500, 1, 30, 25); comp.openInViewer(); } var comp = app.project.activeItem; if (!(comp instanceof CompItem)) { alert("Error: No valid composition"); return; } var shapeLayer = comp.layers.addShape(); if (!shapeLayer) { alert("Error: Failed to create shape layer"); return; } shapeLayer.name = "Star Shape"; var shapeGroup = shapeLayer.property("Contents").addProperty("ADBE Vector Group"); if (!shapeGroup) { alert("Error: Failed to create shape group"); return; } shapeGroup.name = "Star"; var starContent = shapeGroup.property("Contents"); if (!starContent) { alert("Error: Shape group content not found"); return; } var polystar = starContent.addProperty("ADBE Vector Shape - Star"); if (!polystar) { alert("Error: Failed to add star shape"); return; } polystar.property("Points").setValue(5); polystar.property("Inner Radius").setValue(50); polystar.property("Outer Radius").setValue(100); var fill = starContent.addProperty("ADBE Vector Graphic - Fill"); if (!fill) { alert("Error: Failed to add fill"); return; } fill.property("ADBE Vector Fill Color").setValue([1, 0, 0]); fill.property("ADBE Vector Fill Opacity").setValue(100); })();
              - "Create a null layer and make it parent of 8th layer": (function() { if (!app.project.activeItem) { var comp = app.project.items.addComp("New Comp", 1920, 1080, 1, 30, 25); comp.openInViewer(); } var comp = app.project.activeItem; if (!(comp instanceof CompItem)) { alert("Error: No valid composition"); return; } if (comp.numLayers < 8) { alert("Error: Composition must have at least 8 layers"); return; } var nullLayer = comp.layers.addNull(); var eighthLayer = comp.layer(8); eighthLayer.parent = nullLayer; })();
              - "Create a red solid layer named Background": (function() { if (app.project.activeItem == null) { alert("No active composition"); return; } app.project.activeItem.layers.addSolid([1,0,0], "Background", 1920, 1080, 1); })();
              - "Add a Gaussian Blur effect to the selected layer": (function() { if (app.project.activeItem == null || !(app.project.activeItem instanceof CompItem)) { alert("No active composition"); return; } if (app.project.activeItem.selectedLayers.length == 0) { alert("No layer selected"); return; } var layer = app.project.activeItem.selectedLayers[0]; layer.Effects.addProperty("ADBE Gaussian Blur 2"); layer.Effects.property("ADBE Gaussian Blur 2").property("Blurriness").setValue(20); })();
              - "Create an adjustment layer with preset Effects/Lo twixtor 1": (function() { if (app.project.activeItem == null || !(app.project.activeItem instanceof CompItem)) { alert("No active composition"); return; } var adjLayer = app.project.activeItem.layers.addSolid([0,0,0], "Adjustment Layer", app.project.activeItem.width, app.project.activeItem.height, 1); adjLayer.adjustmentLayer = true; var presetName = "Effects/Lo twixtor 1"; var presetFile = new File(Folder.myDocuments.fsName + "/Adobe/After Effects ${aeVersion}/User Presets/" + presetName + (presetName.match(/\.ffx$/) ? "" : ".ffx")); if (!presetFile.exists) { presetFile = new File(Folder.myDocuments.fsName + "/Adobe/After Effects 2023/User Presets/" + presetName + (presetName.match(/\.ffx$/) ? "" : ".ffx")); } if (!presetFile.exists) { presetFile = new File("C:/Program Files/Adobe/Adobe After Effects ${aeVersion}/Support Files/Presets/" + presetName + (presetName.match(/\.ffx$/) ? "" : ".ffx")); } if (!presetFile.exists) { alert("Preset file not found: " + presetName + ". Please place it in User Presets/Effects/ or Default Presets folder for After Effects ${aeVersion} or 2023."); adjLayer.remove(); return; } adjLayer.applyPreset(presetFile); })();
              - "Apply preset MyPresets/CCs/My Preset to the selected layer": (function() { if (app.project.activeItem == null || !(app.project.activeItem instanceof CompItem)) { alert("No active composition"); return; } if (app.project.activeItem.selectedLayers.length == 0) { alert("No layer selected"); return; } var layer = app.project.activeItem.selectedLayers[0]; var presetFile = new File("C:/Users/acer/Documents/Adobe/After Effects 2023/User Presets/MyPresets/CCs/My Preset.ffx"); if (!presetFile.exists) { alert("Preset file not found"); return; } layer.applyPreset(presetFile); })();
              - "Apply preset Trapcode Tao to selected layer": (function() { if (app.project.activeItem == null || !(app.project.activeItem instanceof CompItem)) { alert("No active composition"); return; } if (app.project.activeItem.selectedLayers.length == 0) { alert("No layer selected"); return; } var layer = app.project.activeItem.selectedLayers[0]; var presetPath = Folder.myDocuments.fsName + "/Adobe/After Effects/User Presets/Trapcode/Trapcode Tao.ffx"; var presetFile = new File(presetPath); if (!presetFile.exists) { alert("Preset file not found. Please place 'Trapcode Tao.ffx' in your After Effects User Presets/Trapcode/ folder."); return; } layer.applyPreset(presetFile); })();
`}]
        }
        // system_instruction : [
        //     types.Part.from_text(text="You are an After Effects script generator. You will be given a prompt and you will generate a script that can be run in After Effects. The script should be in JavaScript and should not contain any comments or explanations. The script should be valid and should not contain any errors. The script should be as short as possible while still being valid and functional.")
        // ],
      });
  
      const result = await chat.sendMessage(prompt);
      let script = await result.response.text();

      console.log("Raw Gemini response:", script); // Debug: log raw response

      

      // Clean script: remove markdown, code fences, or extra text
    script = script
    .replace(/```javascript\n|```/g, "")
      .replace(/\/\/.*?\n/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .trim();

      console.log("Cleaned script:", script);
     // Basic validation: ensure script contains After Effects commands
     if (!script.includes("app.") || script.length < 10) {
      return res.status(400).json({ error: "Invalid script generated" });
    }
  
      res.json({ script });
    } catch (err) {
      console.error("❌ Gemini API Error:", err);
      res.status(500).json({ error: err.message ||  "Failed to generate script" });
    }
  });
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
