import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDtnfGTjFGe0KorLsJjmfrEPaVfPCH_fYs",
    authDomain: "shahid-98789.firebaseapp.com",
    projectId: "shahid-98789",
    storageBucket: "shahid-98789.firebasestorage.app",
    messagingSenderId: "203756730991",
    appId: "1:203756730991:web:5f5cf739bbca55f1482b9a",
    measurementId: "G-VY9CR8YX6S",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const firestoreUrl = "/firestore/v1/projects/shahid-98789/databases/(default)/documents";

const productNameInput = document.getElementById("productName");
const wholesalePriceInput = document.getElementById("wholesalePrice");
const sellingPriceInput = document.getElementById("sellingPrice");
const calculateBtn = document.getElementById("calculateBtn");
const profitDisplay = document.getElementById("profitDisplay");
const dataTable = document.getElementById("dataTable");
const endDayBtn = document.getElementById("endDayBtn");

calculateBtn.addEventListener("click", async () => {
    const productName = productNameInput.value.trim();
    const wholesalePrice = parseFloat(wholesalePriceInput.value);
    const sellingPrice = parseFloat(sellingPriceInput.value);

    if (!productName || isNaN(wholesalePrice) || isNaN(sellingPrice)) {
        alert("Please fill all fields with valid values.");
        return;
    }

    // Corrected formula for profit
    const profit = wholesalePrice - sellingPrice;
    const date = new Date().toLocaleString();

    profitDisplay.textContent = profit.toFixed(2);

    const newRow = {
        productName,
        wholesalePrice,
        sellingPrice,
        profit,
        date,
    };

    addRowToTable(newRow);

    productNameInput.value = "";
    wholesalePriceInput.value = "";
    sellingPriceInput.value = "";
    profitDisplay.textContent = "0.00";
});

const addRowToTable = (row) => {
    const { productName, wholesalePrice, sellingPrice, profit, date } = row;
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${date}</td>
        <td>${productName}</td>
        <td>${wholesalePrice.toFixed(2)}</td>
        <td>${sellingPrice.toFixed(2)}</td>
        <td>${profit.toFixed(2)}</td>
        <td><button class="btn btn-danger btn-sm">Delete</button></td>
    `;

    dataTable.appendChild(newRow);
};

endDayBtn.addEventListener("click", async () => {
    const rows = Array.from(dataTable.querySelectorAll("tr"));

    if (rows.length === 0) {
        alert("No records to save.");
        return;
    }

    const today = new Date().toISOString(); // Unique folder name
    const records = rows.map((row) => {
        const cells = row.querySelectorAll("td");
        return {
            date: cells[0].textContent,
            productName: cells[1].textContent,
            wholesalePrice: parseFloat(cells[2].textContent),
            sellingPrice: parseFloat(cells[3].textContent),
            profit: parseFloat(cells[4].textContent),
        };
    });

    try {
        // Save to Firestore
        await fetch(`${firestoreUrl}/history/${today}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fields: {
                    records: {
                        arrayValue: {
                            values: records.map((record) => ({
                                mapValue: {
                                    fields: {
                                        date: { stringValue: record.date },
                                        productName: { stringValue: record.productName },
                                        wholesalePrice: { doubleValue: record.wholesalePrice },
                                        sellingPrice: { doubleValue: record.sellingPrice },
                                        profit: { doubleValue: record.profit },
                                    },
                                },
                            })),
                        },
                    },
                },
            }),
        });

        alert("Records saved to history!");
        dataTable.innerHTML = ""; // Clear the dashboard table
    } catch (error) {
        console.error("Error saving records:", error);
    }
});
