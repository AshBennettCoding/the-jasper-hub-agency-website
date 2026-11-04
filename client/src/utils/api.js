const GENERIC_SEND_ERROR = 'Unable to send your inquiry. Please try again later.';

export const sendEmail = async (formData) => {
    let response;
    try {
        response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
    } catch {
        throw new Error(GENERIC_SEND_ERROR);
    }

    let data;
    try {
        data = await response.json();
    } catch {
        throw new Error(GENERIC_SEND_ERROR);
    }

    if (!response.ok) {
        throw new Error(data?.message || GENERIC_SEND_ERROR);
    }

    return data;
};
