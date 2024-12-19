import { reportbug } from '@/utills/service/userSideService/userService/UserHomeService';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

function ReportBug() {
    const [description, setDescription] = useState('');
    const [screenshot, setScreenshot] = useState(null);
    const [message, setMessage] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            description:description,
        }
        setMessage(' ');


    

        try {
               const response = await reportbug(payload);
             

            if (response.isSuccess) {
                toast.success('Bug report submitted successfully!');
                setDescription('');
                setScreenshot(null);
            } else {
                toast.error('Failed to submit the bug report.');
            }
        } catch (error) {
            setMessage('Error submitting the bug report.');
        }
    };

    return (
        <div className="report-bug p-4 border rounded-md shadow-lg w-full auto mt-8 bg-white">
            <h2 className="text-lg font-semibold mb">Report a Bug</h2>
            <p className='text-gray-300 mb-4'>Your feedback is essential in helping us improve the application. Thank you!</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                    name='description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder="Describe the issue"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    ></textarea>
                </div>
                {/* <div>
                    <label className="block text-sm font-medium mb-1">Screenshot (optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div> */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Send
                </button>
                {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
            </form>
        </div>
    );
}

export default ReportBug;
