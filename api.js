const express = require("express");
const Replicate = require("replicate");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080; 

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY,
});

app.use(express.json());
app.use(cors());

let apiCallCount = 0;
const maxApiCalls = 100;


app.post("/generate-image", async (req, res) => {
    if (apiCallCount >= maxApiCalls) {
        return res.status(429).json({ error: "API call limit exceeded. Please try again later." });
    }

    try {
        const { image, scale, prompt, cn_lineart_strength } = req.body;

        console.log("🔄 Sending request to Replicate...");
        const output = await replicate.run(
            "helios-infotech/sketch_to_image:feb7325e48612a443356bff3d0e03af21a42570f87bee6e8ea4f275f2bd3e6f9",
            { input: { image, scale, prompt, cn_lineart_strength } }
        );

        console.log("Image generated! Here is the link:", output);

        apiCallCount++;

        res.json({ imageUrl: output[0] });
    } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).json({ error: "Error generating image" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
