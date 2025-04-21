
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
