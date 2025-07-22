import axios from 'axios';

const BASE_URL = "https://1b823532d8ce.ngrok-free.app/api";

export async function getProcessedImages(token, email) {
    try {
        if (!email) {
            throw new Error("Email is required to fetch processed images");
        }

        const response = await axios.get(`${BASE_URL}/processedImage/get-processed-image`, {
            params: { email: email },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
        });

        if (!response.data.data.images || response.data.data.images.length === 0) {
            throw new Error('No processed images found matching the criteria');
        }

        return response.data.data; // { count, images }
    } catch (error) {
        console.error('Error fetching processed images:', error);
        throw error;
    }
}