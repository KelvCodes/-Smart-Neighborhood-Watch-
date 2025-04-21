 description = document.getElementById("incident-description").value;

    if (title.trim() === "" || description.trim() === "") {
        alert("Please enter valid incident details.");
        return;
    }

    let alertList = document.getElementById("alert-list");
    let listItem = document.createElement("li");
    listItem.innerHTML = `<strong>${title}</strong> - ${description}`;
    alertList.prepend(listItem);

    // Clear fields
    document.getElementById("incident-title").value = "";
    document.getElementById("incident-description").value = "";
});

// Safety Check-In Button
document.getElementById("safe-button").addEventListener("click", function() {
    let safeStatus = document.getElementById("safe-status");
    safeStatus.innerText = "✅ You have checked in as safe!";
    safeStatus.style.color = "#2ed573";
});
