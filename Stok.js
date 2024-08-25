let allData = []; // Menyimpan semua data CSV

        // Fungsi untuk membaca file CSV dari GitHub
        function loadCSV() {
            fetch('https://raw.githubusercontent.com/TIMSMD24/DataSMD/main/stok.csv') // Gantilah URL ini dengan URL CSV Anda di GitHub
                .then(response => response.text())
                .then(data => {
                    const rows = data.split('\n');
                    
                    // Simpan semua data CSV ke dalam array `allData`
                    for (let i = 1; i < rows.length; i++) { // mulai dari 1 untuk melewati header
                        const cells = rows[i].split(',');

                        if (cells.length === 4) { // pastikan baris memiliki 4 kolom
                            allData.push(cells);
                        }
                    }

                    // Tampilkan data awal (semua data)
                    filterData(); // Langsung memanggil filter untuk menampilkan tabel kosong atau dengan data awal
                })
                .catch(error => console.error('Error membaca file CSV:', error));
        }

        // Fungsi untuk menampilkan data ke tabel
        function displayTables(filteredData) {
            const onhandTableBody = document.querySelector('#onhandTable tbody');
            const gitTableBody = document.querySelector('#gitTable tbody');

            // Kosongkan isi tabel sebelumnya
            onhandTableBody.innerHTML = '';
            gitTableBody.innerHTML = '';

            // Data yang akan ditampilkan
            const products = {}; // Menyimpan data produk, dist, dan nilai onhand/git

            filteredData.forEach(row => {
                const [dist, product, onhand, git] = row;

                if (!products[product]) {
                    products[product] = {
                        MPI: { onhand: 0, git: 0 },
                        KLP: { onhand: 0, git: 0 },
                        PVL: { onhand: 0, git: 0 }
                    };
                }

                // Masukkan data Onhand dan GIT ke produk yang sesuai
                products[product][dist].onhand = parseInt(onhand, 10);
                products[product][dist].git = parseInt(git, 10);
            });

            // Menampilkan data ke tabel
            for (const product in products) {
                const onhandRow = document.createElement('tr');
                const gitRow = document.createElement('tr');

                const onhandCell = document.createElement('td');
                const gitCell = document.createElement('td');

                onhandCell.textContent = product;
                gitCell.textContent = product;

                onhandRow.appendChild(onhandCell);
                gitRow.appendChild(gitCell);

                // Masukkan data Onhand dan GIT untuk MPI, KLP, PVL
                ['MPI', 'KLP', 'PVL'].forEach(dist => {
                    const onhandDistCell = document.createElement('td');
                    const gitDistCell = document.createElement('td');

                    onhandDistCell.textContent = products[product][dist].onhand;
                    gitDistCell.textContent = products[product][dist].git;

                    onhandRow.appendChild(onhandDistCell);
                    gitRow.appendChild(gitDistCell);
                });

                onhandTableBody.appendChild(onhandRow);
                gitTableBody.appendChild(gitRow);
            }
        }

        // Fungsi untuk memfilter data berdasarkan input produk yang diketik
        function filterData() {
            const input = document.getElementById('productFilter').value.toUpperCase(); // Dapatkan input produk
            const filteredData = allData.filter(row => row[1].toUpperCase().includes(input)); // Filter berdasarkan produk

            // Tampilkan data yang difilter
            displayTables(filteredData);
        }

        // Event listener untuk input filter
        document.getElementById('productFilter').addEventListener('input', filterData);

        // Panggil fungsi saat halaman dimuat
        window.onload = loadCSV;
