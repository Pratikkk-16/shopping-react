import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const products = {
  "123456": { name: "Product 1", price: 10.99, weight: "1kg" },
  "789012": { name: "Product 2", price: 5.49, weight: "500g" },
  "345678": { name: "Product 3", price: 2.99, weight: "200g" },
};

function App() {
  const [barcode, setBarcode] = useState("");
  const [productInfo, setProductInfo] = useState({ name: "", price: 0, weight: "" });
  const [bill, setBill] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleBarcodeChange = (e) => {
    const barcode = e.target.value;
    setBarcode(barcode);
    displayProductInfo(barcode);
  };

  const displayProductInfo = (barcode) => {
    const product = products[barcode];
    if (product) {
      setProductInfo(product);
    } else {
      setProductInfo({ name: "Not Found", price: 0, weight: "N/A" });
    }
  };

  const addToBill = () => {
    const product = products[barcode];
    if (product) {
      setBill([...bill, product]);
      setTotalAmount(totalAmount + product.price);
      setBarcode(""); // Clear the input
      setProductInfo({ name: "", price: 0, weight: "" }); // Reset product info
    } else {
      alert("Product not found!");
    }
  };

  const deleteFromBill = () => {
    const barcodeToDelete = prompt("Scan the product barcode to delete:");
    const product = products[barcodeToDelete];
    if (product) {
      const updatedBill = bill.filter((item) => item.name !== product.name);
      setBill(updatedBill);
      setTotalAmount(totalAmount - product.price);
    } else {
      alert("Product not found!");
    }
  };

  const printBill = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const generateQRCode = () => {
    const qrText = `Total: $${totalAmount.toFixed(2)}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrText)}`;
  };

  return (
    <div className="App">
      <h1>Barcode Billing System</h1>
      <div className="barcode-input">
        <input
          type="text"
          placeholder="Scan or enter barcode"
          value={barcode}
          onChange={handleBarcodeChange}
        />
        <button onClick={addToBill}>Add to Bill</button>
      </div>
      <div className="product-info">
        <h2>Product Information</h2>
        <p>Name: {productInfo.name}</p>
        <p>Price: ${productInfo.price.toFixed(2)}</p>
        <p>Weight: {productInfo.weight}</p>
      </div>
      <div className="bill-section">
        <h2>Bill</h2>
        <ul>
          {bill.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price.toFixed(2)}
            </li>
          ))}
        </ul>
        <p>Total Amount: ${totalAmount.toFixed(2)}</p>
        <button onClick={deleteFromBill}>Delete from Bill</button>
        <button onClick={printBill}>Print Bill</button>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Print Bill</h2>
            <ul>
              {bill.map((item, index) => (
                <li key={index}>
                  {item.name} - ${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
            <p>Total Amount: ${totalAmount.toFixed(2)}</p>
            <img src={generateQRCode()} alt="QR Code" />
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
