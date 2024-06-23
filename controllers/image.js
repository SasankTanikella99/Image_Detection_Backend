


//index.js file

///////////////////////////////////////////////////////////////////////////////////////////////////
// In this section, we set the user authentication, user and app ID, model details, and the URL
// of the image we want as an input. Change these strings to run your own example.
///////////////////////////////////////////////////////////////////////////////////////////////////

// Your PAT (Personal Access Token) can be found in the Account's Security section

// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope

// Change these to whatever model and image URL you want to use
// To use a local file, assign the location variable
// const IMAGE_FILE_LOCATION = 'YOUR_IMAGE_FILE_LOCATION_HERE'

///////////////////////////////////////////////////////////////////////////////////
// YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
///////////////////////////////////////////////////////////////////////////////////



// This will be used by every Clarifai endpoint call


// To use a local text file, uncomment the following lines
// const fs = require("fs");
// const imageBytes = fs.readFileSync(IMAGE_FILE_LOCATION);
import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";

// Constants for Clarifai API
const PAT = 'f0dd29f5ab04485884032c2e5e195f0b';
const USER_ID = 'clarifai';
const APP_ID = 'main';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

export const handleApiCall = (req, res) => {
    const imageUrl = req.body.input;

    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.length > 2000) {
        return res.status(400).json({ error: "Invalid image URL provided" });
    }

    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            version_id: MODEL_VERSION_ID,
            inputs: [
                {
                    data: {
                        image: {
                            url: imageUrl,
                            allow_duplicate_url: true
                        }
                    }
                }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.error("Error: " + err);
                return res.status(500).json({ error: "Failed to call Clarifai API" });
            }

            if (response.status.code !== 10000) {
                console.error("Received failed status: " + response.status.description + "\n" + response.status.details);
                return res.status(400).json({ error: "Invalid request to Clarifai API" });
            }

            // Print full response for debugging
            console.log("Full API response: ", JSON.stringify(response, null, 2));

            console.log("Predicted concepts, with confidence values:");
            for (const c of response.outputs[0].data.concepts) {
                console.log(`${c.name}: ${c.value}`);
            }
            res.json(response);
        }
    );
}

export const handleImageDetect = (req, res, db) => {
    const { id } = req.body;

    if (!id || typeof id !== 'number') {
        return res.status(400).json({ message: 'Invalid user ID type' });
    }
    
    db('users').where('id', '=', id).increment('entries', 1).returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(error => {
        res.status(500).json({ message: error.message });
    });
}
