
// Function to check if elements exist
function checkElements() {
    console.log("Checking for comment elements...");
    const commentForm = document.getElementById("comment-form");
    const commentSection = document.getElementById("comment-section");
    
    console.log("Comment form exists:", !!commentForm);
    console.log("Comment section exists:", !!commentSection);
    
    if (commentForm && commentSection) {
        console.log("Both elements found, initializing comments");
        initComments(commentForm, commentSection);
    } else {
        console.log("Elements not found, will check again in 1 second");
        setTimeout(checkElements, 1000);
    }
}

// Initialize comments system
function initComments(form, section) {
    console.log("Loading existing comments");
    loadComments(section);
    
    console.log("Setting up form submission handler");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        console.log("Form submitted");
        
        const nameInput = document.getElementById("name");
        const commentInput = document.getElementById("comment");
        
        console.log("Name input exists:", !!nameInput);
        console.log("Comment input exists:", !!commentInput);
        
        if (nameInput && commentInput) {
            const name = nameInput.value.trim();
            const comment = commentInput.value.trim();
            
            console.log("Name:", name);
            console.log("Comment:", comment);
            
            if (name && comment) {
                saveComment(name, comment, section);
                form.reset();
            } else {
                
                console.error("Name or comment is empty");
            }
        } else {
            console.error("Could not find name or comment input fields");
        }
    });
    
    // Set up event delegation for comment deletion
    section.addEventListener("click", function(event) {
        if (event.target.classList.contains("delete-comment")) {
            const commentId = event.target.dataset.id;
            console.log("Delete button clicked for comment:", commentId);
            removeComment(commentId, section);
        }
    });
}

// Save comment to localStorage
function saveComment(name, text, section) {
    console.log("Saving comment:", name, text);
    const newComment = { 
        id: Date.now().toString(), // Use timestamp as unique ID
        name, 
        text, 
        timestamp: new Date().toISOString() 
    };
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.push(newComment);
    localStorage.setItem("comments", JSON.stringify(comments));
    
    // Display the new comment
    displayComment(newComment, section);
}

// Display a comment in the DOM
function displayComment(comment, section) {
    console.log("Displaying comment:", comment);
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment");
    commentDiv.dataset.id = comment.id;
    
    commentDiv.innerHTML = `
        <div class="comment-header">
            <strong>${comment.name}</strong>
            <button class="delete-comment" data-id="${comment.id}">Delete</button>
        </div>
        <div class="comment-text">${comment.text}</div>
    `;
    
    section.appendChild(commentDiv);
}

// Remove a comment
function removeComment(commentId, section) {
    console.log("Removing comment with ID:", commentId);
    
    // Get comments from localStorage
    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    
    // Filter out the comment to remove
    comments = comments.filter(comment => comment.id !== commentId);
    
    // Save filtered comments back to localStorage
    localStorage.setItem("comments", JSON.stringify(comments));
    
    // Remove from DOM
    const commentElement = section.querySelector(`.comment[data-id="${commentId}"]`);
    if (commentElement) {
        commentElement.remove();
        console.log("Comment removed from DOM");
    } else {
        console.error("Could not find comment element in DOM");
    }
}

// Load comments from localStorage
function loadComments(section) {
    console.log("Attempting to load comments from localStorage");
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    console.log("Found", comments.length, "comments");
    
    section.innerHTML = "";
    comments.forEach(comment => {
        // Add ID if it doesn't exist (for backward compatibility)
        if (!comment.id) {
            comment.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
        }
        displayComment(comment, section);
    });
}

// Start checking for elements once DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM Content Loaded event fired");
    checkElements();
});

// Also listen for a custom event that might be fired when templates are loaded
document.addEventListener("commentsLoaded", function() {
    console.log("commentsLoaded event received");
    checkElements();
});