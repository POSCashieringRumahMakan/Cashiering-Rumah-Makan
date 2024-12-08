// Contoh data awal pesanan
const orders = [
    {
      id: 1,
      customerName: 'John Doe',
      menuName: 'Nasi Goreng',
      quantity: 2,
      totalPrice: 50000,
      tableNumber: 5,
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      menuName: 'Mie Ayam',
      quantity: 1,
      totalPrice: 25000,
      tableNumber: 3,
    },
    // Tambahkan data pesanan lainnya di sini
  ];
  
  // Menampilkan pesanan dalam bentuk card
  function displayOrders() {
    const orderContainer = document.getElementById('order-data');
    orderContainer.innerHTML = '';
  
    orders.forEach(order => {
      const orderCard = document.createElement('div');
      orderCard.classList.add('order-card');
      orderCard.innerHTML = `
        <h3>Pesanan #${order.id}</h3>
        <p><strong>Nama Customer:</strong> ${order.customerName}</p>
        <p><strong>Nama Menu:</strong> ${order.menuName}</p>
        <p><strong>Kuantiti:</strong> ${order.quantity}</p>
        <p><strong>Total Harga:</strong> Rp ${order.totalPrice}</p>
        <p><strong>No Kursi:</strong> ${order.tableNumber}</p>
     
        <button onclick="deleteOrder(${order.id})">Hapus</button>
        <button onclick="viewDetail(${order.id})">Detail</button>
      `;
      orderContainer.appendChild(orderCard);
    });
  }
  
  // Fungsi untuk mencari pesanan
  function searchOrders() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const filteredOrders = orders.filter(order => 
      order.customerName.toLowerCase().includes(searchQuery) || 
      order.menuName.toLowerCase().includes(searchQuery)
    );
    
    displayFilteredOrders(filteredOrders);
  }
  
  // Menampilkan pesanan yang difilter
  function displayFilteredOrders(filteredOrders) {
    const orderContainer = document.getElementById('order-data');
    orderContainer.innerHTML = '';
  
    filteredOrders.forEach(order => {
      const orderCard = document.createElement('div');
      orderCard.classList.add('order-card');
      orderCard.innerHTML = `
        <h3>Pesanan #${order.id}</h3>
        <p><strong>Nama Customer:</strong> ${order.customerName}</p>
        <p><strong>Nama Menu:</strong> ${order.menuName}</p>
        <p><strong>Kuantiti:</strong> ${order.quantity}</p>
        <p><strong>Total Harga:</strong> Rp ${order.totalPrice}</p>
        <p><strong>No Kursi:</strong> ${order.tableNumber}</p>
        <button onclick="editOrder(${order.id})">Edit</button>
        <button onclick="deleteOrder(${order.id})">Hapus</button>
        <button onclick="viewDetail(${order.id})">Detail</button>
      `;
      orderContainer.appendChild(orderCard);
    });
  }
  
  // Menambahkan fungsi Edit, Hapus, dan Detail (CRUD)
  function editOrder(orderId) {
    // Implementasikan fungsi untuk mengedit pesanan
    alert(`Edit Pesanan #${orderId}`);
  }
  
  function deleteOrder(orderId) {
    // Implementasikan fungsi untuk menghapus pesanan
    alert(`Hapus Pesanan #${orderId}`);
  }
  
  function viewDetail(orderId) {
    const order = orders.find(o => o.id === orderId);
    const detailModal = document.getElementById('detail-order-modal');
    const orderDetail = document.getElementById('order-detail');
    orderDetail.innerHTML = `
      <p><strong>Nama Customer:</strong> ${order.customerName}</p>
      <p><strong>Nama Menu:</strong> ${order.menuName}</p>
      <p><strong>Kuantiti:</strong> ${order.quantity}</p>
      <p><strong>Total Harga:</strong> Rp ${order.totalPrice}</p>
      <p><strong>No Kursi:</strong> ${order.tableNumber}</p>
    `;
    detailModal.style.display = 'block';
  }
  
  function closeDetailModal() {
    document.getElementById('detail-order-modal').style.display = 'none';
  }
  
  function closeEditModal() {
    document.getElementById('edit-order-modal').style.display = 'none';
  }
  
  // Fungsi untuk mencetak riwayat pesanan ke PDF
  function printPDF() {
    const orderContainer = document.getElementById('order-data');
    const orderHTML = orderContainer.innerHTML;
    const printWindow = window.open('', '', 'height=800, width=1200');
    printWindow.document.write('<html><head><title>Riwayat Pesanan</title></head><body>');
    printWindow.document.write(orderHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  }
  
  displayOrders();
  