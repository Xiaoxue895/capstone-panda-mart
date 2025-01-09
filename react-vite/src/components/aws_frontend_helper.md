AWS S3 Walkthrough: Phase 4 - React Setup

In this phase, you will modify your React frontend to enable file uploads to AWS S3. Here’s a breakdown of the process:

### 1. **Frontend Form Refactor**
You need to refactor your frontend form to handle file uploads. The main changes include:
- Add `encType="multipart/form-data"` to the `<form>` tag to ensure the form can submit files.
- Replace the text field (if any) for the image/video URL with an actual file input field (`<input type="file">`).
- Use the `onChange` listener to capture the selected file and update the React state.

Example of the updated form:

```jsx
<form 
    onSubmit={handleSubmit}
    encType="multipart/form-data"
>
    <input
        type="file"
        accept="image/*" // Restrict to images
        onChange={(e) => setImage(e.target.files[0])} // Set image state to the selected file
    />
    <button type="submit">Submit</button>
    {(imageLoading) && <p>Loading...</p>} {/* Show loading status */}
</form>
```

### 2. **Refactor the `onSubmit` Function**
Instead of sending JSON data in your `onSubmit` function, you'll use `FormData`. `FormData` allows you to append the selected file along with other form data. This is a simpler approach compared to manually serializing a file into JSON.

Here's how the `onSubmit` function can be updated:

```jsx
const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);  // Append the file to the FormData object
    
    // Set loading state to show the user that the file is uploading
    setImageLoading(true);
    
    await dispatch(createPost(formData));  // Dispatch the formData to create a post
    history.push("/images");  // Redirect after successful upload
}
```

### 3. **Update Your Thunk**
Now you need to update your thunk function to handle the `FormData` sent from the frontend. Since the form data is now binary (i.e., a file), you should NOT set `Content-Type` headers manually, as the browser will handle it for you. Also, the request body should be the `FormData` object, not a JSON string.

Here's how your updated thunk might look:

```jsx
export const createImage = (post) => async (dispatch) => {
    const response = await fetch(`/images/new`, {
        method: "POST",
        body: post,  // Send the FormData directly
    });

    if (response.ok) {
        const { resPost } = await response.json();  // Extract the response if the upload is successful
        dispatch(addPost(resPost));  // Update the state with the new post
    } else {
        console.log("There was an error making your post!");  // Handle errors
    }
};
```

### 4. **Test and Celebrate**
Once you’ve implemented these changes, it’s time to test the entire upload process. Make sure to:
- Test uploading a file from the React frontend.
- Check that the file is successfully uploaded to your AWS S3 bucket.
- Ensure that the correct URL is saved in your database (through your Flask backend).
- Test edge cases, such as large files or unsupported file types.

### Final Component Example

Here’s how your component and thunk should look once everything is set up:

```jsx
// UploadPicture Component
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createPost } from "./postActions";  // Assuming this is your action

const UploadPicture = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [image, setImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", image);  // Attach the image file to the form data
        
        setImageLoading(true);  // Show loading message while uploading
        await dispatch(createPost(formData));  // Dispatch the form data to the server
        history.push("/images");  // Redirect after successful upload
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
            />
            <button type="submit">Submit</button>
            {imageLoading && <p>Loading...</p>}
        </form>
    );
};

export default UploadPicture;

// Thunk for Handling Image Upload
export const createImage = (post) => async (dispatch) => {
    const response = await fetch(`/images/new`, {
        method: "POST",
        body: post,  // Send the FormData to the backend
    });

    if (response.ok) {
        const { resPost } = await response.json();  // Handle success
        dispatch(addPost(resPost));  // Update the state with the new post
    } else {
        console.log("There was an error making your post!");
    }
};
```

### Key Points:
1. Use `FormData` to handle both files and form data at once.
2. Set `encType="multipart/form-data"` on the form for file uploads.
3. Don’t manually set `Content-Type` headers when using `FormData`; let the browser handle it.
4. Ensure the backend is prepared to handle the incoming `FormData`.