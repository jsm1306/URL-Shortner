import React from 'react'


export default function Response({response}) {
  // Handle both old and new response formats
  const shortenedUrl = response.shortUrl || (`https://url-shortner-z06h.onrender.com/api/s/${response.shortCode}`);
  const qrCode = response.qrCode;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortenedUrl);
    alert('Shortened URL copied to clipboard!');
  };

  const downloadQRCode = () => {
    if (!qrCode) return;
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qr-${response.shortCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '20px', textAlign: 'center' }}>
      <h2 style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed, #ec4899)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: 'none' }}>Your Shortened URL Created Successfully!</h2>
      
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(6, 182, 212, 0.2))',
        padding: '20px', 
        borderRadius: '12px',
        marginBottom: '20px',
        wordBreak: 'break-all',
        border: '2px solid rgba(0, 212, 255, 0.3)',
        boxShadow: '0 0 20px rgba(124, 58, 237, 0.2)'
      }}>
        <p style={{ color: '#b0d4e8' }}><strong>Shortened URL:</strong></p>
        <p style={{ fontSize: '16px', color: '#00d4ff', textShadow: '0 0 10px rgba(0, 212, 255, 0.4)' }}>{shortenedUrl}</p>
      </div>

      {qrCode && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 60, 0.8), rgba(26, 26, 46, 0.8))',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          display: 'inline-block',
          border: '2px solid rgba(0, 212, 255, 0.3)',
          boxShadow: '0 0 20px rgba(124, 58, 237, 0.2)'
        }}>
          <p style={{ marginTop: 0, color: '#00d4ff', textShadow: '0 0 10px rgba(0, 212, 255, 0.3)' }}><strong>QR Code</strong></p>
          <img 
            src={qrCode} 
            alt="QR Code" 
            style={{ width: '250px', height: '250px' }}
          />
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={copyToClipboard}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            color: 'white',
            border: '2px solid rgba(0, 212, 255, 0.4)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            marginRight: '10px',
            fontWeight: '700',
            boxShadow: '0 0 15px rgba(124, 58, 237, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => e.target.style.boxShadow = '0 0 25px rgba(236, 72, 153, 0.5), 0 0 15px rgba(0, 212, 255, 0.4)'}
          onMouseLeave={(e) => e.target.style.boxShadow = '0 0 15px rgba(124, 58, 237, 0.3)'}
        >
          Copy URL
        </button>

        {qrCode && (
          <button 
            onClick={downloadQRCode}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #ec4899, #06b6d4)',
              color: 'white',
              border: '2px solid rgba(236, 72, 153, 0.4)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              marginRight: '10px',
              fontWeight: '700',
              boxShadow: '0 0 15px rgba(236, 72, 153, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => e.target.style.boxShadow = '0 0 25px rgba(236, 72, 153, 0.5), 0 0 15px rgba(0, 212, 255, 0.4)'}
            onMouseLeave={(e) => e.target.style.boxShadow = '0 0 15px rgba(236, 72, 153, 0.3)'}
          >
            Download QR Code
          </button>
        )}
      </div>
    </div>
  )
}
