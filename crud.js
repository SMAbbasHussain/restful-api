const apiUrl = "https://672ddcb2fd8979715644034c.mockapi.io/products/product";
const output = document.getElementById("output");
const tooltip = document.getElementById("tooltip");

// Fetch products from API
async function fetchProducts() {
  clearTable();
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    displayProductsInTable(data);
  } catch (error) {
    console.error("Fetch products failed:", error);
  }
}

// Display products in table
function displayProductsInTable(products) {
  clearTable();
  products.forEach(product => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td class="actions">
        <button class="edit" onclick="editProduct(${product.id})">Edit</button>
        <button class="delete" onclick="deleteProduct(${product.id}, this.closest('tr'))">Delete</button>
      </td>
    `;
    output.appendChild(row);
  });
}

// Remove row from table without affecting API data
function deleteProduct(id, rowElement) {
  fetch(`${apiUrl}/${id}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then(() => {
      rowElement.remove(); // Remove the row from the table if API deletion is successful
    })
    .catch((error) => console.error("Error deleting product:", error));
}

// Edit product by ID
function editProduct(id) {
  const newName = prompt("Enter new product name:");
  const newPrice = prompt("Enter new product price:");

  if (newName && newPrice) {
    fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
        price: newPrice,
      }),
    })
      .then(response => response.json())
      .then(updatedProduct => {
        alert("Product updated successfully!");
        fetchProducts(); // Refresh the product list
      })
      .catch((error) => console.error("Error updating product:", error));
  }
}

// Create a new product
function createProduct() {
  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;

  if (name && price) {
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        price: price,
      }),
    })
      .then(response => response.json())
      .then(newProduct => {
        alert("Product created successfully!");
        fetchProducts(); // Refresh the product list
      })
      .catch((error) => console.error("Error creating product:", error));
  } else {
    alert("Please enter both name and price.");
  }
}

// Read product by ID or Name
async function readProduct() {
  const productIdOrName = document.getElementById("productId").value;
  try {
    // Fetch the product by ID or name
    const response = await fetch(`${apiUrl}?name=${productIdOrName}`);
    if (!response.ok) {
      throw new Error('Product not found');
    }
    const data = await response.json();

    if (data.length > 0) {
      const product = data[0];  // If product is found, use the first match
      output.innerHTML = `
        <p>Product Details:</p>
        <p><strong>ID:</strong> ${product.id}</p>
        <p><strong>Name:</strong> ${product.name}</p>
        <p><strong>Price:</strong> ${product.price}</p>
      `;
    } else {
      output.innerHTML = "<p>No product found with that name.</p>";
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    output.innerHTML = "<p>Error fetching product</p>";
  }
}

// Clear table
function clearTable() {
  output.innerHTML = "";
}

// Show tooltip when hovering over a button
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('mouseenter', () => {
    tooltip.textContent = button.textContent;  // Show the button's text in the tooltip
    tooltip.classList.add('active');
    tooltip.style.left = `${button.getBoundingClientRect().left + window.scrollX}px`;
    tooltip.style.top = `${button.getBoundingClientRect().top + window.scrollY - 30}px`;
  });

  button.addEventListener('mouseleave', () => {
    tooltip.classList.remove('active');
  });
});

// Initial load
