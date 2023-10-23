const selection = document.getElementById('subject');

if(selection.children.length > 0) {
    selection.disabled = false;
} else {
    selection.disabled = true;
}