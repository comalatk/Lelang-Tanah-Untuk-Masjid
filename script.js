const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR8FWUuq2J_p9jwVB43Pvy_jiuenlDV5htgsCcYaBKp6oF-io0n7UYKj4yUCRV92RUqMzY8KauEat-D/pub?output=csv';
const sheetUrl2 = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR8FWUuq2J_p9jwVB43Pvy_jiuenlDV5htgsCcYaBKp6oF-io0n7UYKj4yUCRV92RUqMzY8KauEat-D/pub?gid=42780574&single=true&output=csv';

const kotakTotal = 52;       // Untuk lelang pertama
const kotakTotal2 = 520;     // Untuk lelang kedua
const container = document.getElementById('grid-container');
const container2 = document.getElementById('grid-container-2');
const totalMasukEl = document.getElementById('total-masuk');
const totalMasukEl2 = document.getElementById('total-masuk-2');

function formatRupiah(angka) {
  return "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function openModal(message) {
  document.getElementById('modal-text').textContent = message;
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

function fetchData(sheetUrl, kotakTotal, container, totalEl, minimumValue) {
  fetch(sheetUrl)
    .then(response => response.text())
    .then(csvText => {
      const rows = csvText.trim().split('\n').slice(1);
      const data = rows.map(row => {
        const cols = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
        if (!cols) return { nama: '', jumlah: 0, penerima: '' };

        const nama = (cols[0] || '').replace(/^"|"$/g, '').trim();
        const nominal = (cols[1] || '0').replace(/\D/g, '');
        const penerima = (cols[2] || 'Belum diketahui').replace(/^"|"$/g, '').trim();

        return {
          nama,
          jumlah: parseInt(nominal) || 0,
          penerima
        };
      });

      let totalMasuk = 0;
      container.innerHTML = '';

      for (let i = 0; i < kotakTotal; i++) {
        const kotak = document.createElement('div');
        kotak.classList.add('kotak');

        const nomor = i + 1;

        if (data[i]) {
          kotak.textContent = `${nomor}. ${data[i].nama || 'PO'}`;

          if (data[i].jumlah >= minimumValue) {
            kotak.classList.add('hijau');
            totalMasuk += data[i].jumlah;
          } else if (data[i].jumlah > 0) {
            kotak.classList.add('biru');
            totalMasuk += data[i].jumlah;
          } else {
            kotak.classList.add('kuning');
          }

          kotak.addEventListener('click', () => {
            openModal(`Dana diterima oleh: ${data[i].penerima}`);
          });
        } else {
          kotak.textContent = `${nomor}. Kosong`;
          kotak.classList.add('kosong');
        }

        container.appendChild(kotak);
      }

      totalEl.textContent = formatRupiah(totalMasuk);
    })
    .catch(error => {
      container.innerHTML = 'Gagal memuat data.';
      console.error('Fetch error:', error);
    });
}

// Lelang 1: 1 juta/orang
fetchData(sheetUrl, kotakTotal, container, totalMasukEl, 1000000);

// Lelang 2: 720 ribu/orang
fetchData(sheetUrl2, kotakTotal2, container2, totalMasukEl2, 720000);
