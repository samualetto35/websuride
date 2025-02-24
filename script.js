document.addEventListener('DOMContentLoaded', function() {
    // Google Apps Script Web Uygulaması URL'si
    const apiUrl = 'https://script.google.com/macros/s/AKfycbwIdqd7lNuOJD0RDJPgjm_iAL-w7hI7FffGfOxJnvHmvsPN6TUvXQGV8X_5VuAlIU_Z/exec';
    
    // Yükleniyor mesajını göster
    document.getElementById('rides-list').innerHTML = '<div class="loading">Veriler yükleniyor...</div>';
    
    // Verileri çek
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.rides && data.rides.length > 0) {
                displayRidesFromArray(data.rides);
            } else {
                document.getElementById('rides-list').innerHTML = 
                    '<div class="no-rides">Henüz hiç ilan bulunmuyor.</div>';
            }
        })
        .catch(error => {
            console.error('Veri çekme hatası:', error);
            document.getElementById('rides-list').innerHTML = 
                '<div class="error">Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</div>';
        });
});

function displayRidesFromArray(rides) {
    const ridesList = document.getElementById('rides-list');
    ridesList.innerHTML = ''; // Yükleniyor mesajını temizle
    
    // Her sürüş için bir kart oluştur
    rides.forEach(ride => {
        // İletişim bilgilerini kontrol et
        const displayName = ride.name === 'gizli' ? 'İsim gizli' : ride.name;
        const displayContact = (ride.email === 'gizli' || ride.phone === 'gizli') ? 
            '<p><em>İletişim bilgileri gizli</em></p>' : 
            `<p><strong>E-posta:</strong> ${ride.email}</p>
             <p><strong>Telefon:</strong> ${ride.phone}</p>`;
        
        // Kart HTML'ini oluştur
        const cardHTML = `
            <div class="ride-card">
                <h3>${displayName}</h3>
                <div class="ride-info">
                    <p><strong>Ne zaman:</strong> ${ride.when}</p>
                    <p><strong>Nereye:</strong> ${ride.where}</p>
                    ${ride.note ? `<p><strong>Not:</strong> ${ride.note}</p>` : ''}
                    ${displayContact}
                </div>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSdUZ146zUeCXOeRjugWFnAK93efTfu5hxOnRjT8DOVRKnz4_g/viewform?usp=share_link&entry.1=${ride.id}" 
                   class="contact-btn" target="_blank">
                   İletişim Bilgini Gönder
                </a>
            </div>
        `;
        
        // Kartı listeye ekle
        ridesList.innerHTML += cardHTML;
    });
    
    // Hiç ilan yoksa mesaj göster
    if (ridesList.innerHTML === '') {
        ridesList.innerHTML = '<div class="no-rides">Henüz hiç ilan bulunmuyor.</div>';
    }
}

// Orijinal fonksiyon (Google Sheets API için)
function displayRides(table) {
    const ridesList = document.getElementById('rides-list');
    ridesList.innerHTML = ''; // Yükleniyor mesajını temizle
    
    // Tablo başlıklarını ve verileri al
    const headers = table.cols.map(col => col.label);
    const rows = table.rows;
    
    // Her satır için bir kart oluştur
    rows.forEach(row => {
        // Boş satırları atla
        if (!row.c[0] || !row.c[0].v) return;
        
        // Veri değerlerini al
        const id = row.c[0]?.v || '';
        const name = row.c[1]?.v || 'İsim belirtilmemiş';
        const email = row.c[2]?.v || '';
        const phone = row.c[3]?.v || '';
        const when = row.c[4]?.v || 'Belirtilmemiş';
        const where = row.c[5]?.v || 'Belirtilmemiş';
        const note = row.c[6]?.v || '';
        
        // İletişim bilgilerini kontrol et
        const displayName = name === 'gizli' ? 'İsim gizli' : name;
        const displayContact = (email === 'gizli' || phone === 'gizli') ? 
            '<p><em>İletişim bilgileri gizli</em></p>' : 
            `<p><strong>E-posta:</strong> ${email}</p>
             <p><strong>Telefon:</strong> ${phone}</p>`;
        
        // Kart HTML'ini oluştur
        const cardHTML = `
            <div class="ride-card">
                <h3>${displayName}</h3>
                <div class="ride-info">
                    <p><strong>Ne zaman:</strong> ${when}</p>
                    <p><strong>Nereye:</strong> ${where}</p>
                    ${note ? `<p><strong>Not:</strong> ${note}</p>` : ''}
                    ${displayContact}
                </div>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSdUZ146zUeCXOeRjugWFnAK93efTfu5hxOnRjT8DOVRKnz4_g/viewform?usp=share_link&entry.1=${id}" 
                   class="contact-btn" target="_blank">
                   İletişim Bilgini Gönder
                </a>
            </div>
        `;
        
        // Kartı listeye ekle
        ridesList.innerHTML += cardHTML;
    });
    
    // Hiç ilan yoksa mesaj göster
    if (ridesList.innerHTML === '') {
        ridesList.innerHTML = '<div class="no-rides">Henüz hiç ilan bulunmuyor.</div>';
    }
} 
