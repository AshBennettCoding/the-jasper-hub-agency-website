const API_URL = process.env.REACT_APP_API_URL || process.env.production.REACT_APP_SITE_URL || process.env.production.REACT_APP_API_URL;

export const sendEmail = async (formData) => {
    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to send email');
        }

        return data;
    } catch (error) {
        throw error;
    }
};
