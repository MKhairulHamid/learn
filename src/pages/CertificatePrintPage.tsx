import { useParams } from 'react-router-dom'
import { Loader2, XCircle, Printer, ArrowLeft } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useCertificate } from '../hooks/useCohortReview'

export default function CertificatePrintPage() {
  const { certId } = useParams<{ certId: string }>()
  const { certificate, loading, notFound } = useCertificate(certId)

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    )
  }

  if (notFound || !certificate) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <XCircle size={32} className="text-red-400 mx-auto mb-4" />
          <p className="text-gray-600">Certificate not found.</p>
        </div>
      </div>
    )
  }

  const issuedDate = new Date(certificate.issued_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const verifyUrl = `${window.location.origin}${window.location.pathname.split('#')[0]}#/verify/${certificate.id}`

  return (
    <>
      {/* Print controls — hidden when printing */}
      <div className="no-print fixed top-0 left-0 right-0 z-10 bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors"
        >
          <Printer size={14} />
          Print / Save as PDF
        </button>
      </div>

      {/* Page wrapper — adds top padding on screen, resets on print */}
      <div className="no-print-pt pt-14 min-h-screen bg-gray-100 flex items-center justify-center p-8">
        {/* Certificate */}
        <div
          className="certificate-page bg-white shadow-2xl"
          style={{
            width: '842px',
            height: '595px',
            position: 'relative',
            fontFamily: 'Georgia, "Times New Roman", serif',
            overflow: 'hidden',
          }}
        >
          {/* Outer border */}
          <div style={{
            position: 'absolute', inset: '12px',
            border: '2.5px solid #1e3a5f',
            pointerEvents: 'none',
          }} />
          {/* Inner border */}
          <div style={{
            position: 'absolute', inset: '18px',
            border: '1px solid #c8a845',
            pointerEvents: 'none',
          }} />
          {/* Corner accents */}
          {[
            { top: '22px', left: '22px', borderWidth: '2px 0 0 2px' },
            { top: '22px', right: '22px', borderWidth: '2px 2px 0 0' },
            { bottom: '22px', left: '22px', borderWidth: '0 0 2px 2px' },
            { bottom: '22px', right: '22px', borderWidth: '0 2px 2px 0' },
          ].map((style, i) => (
            <div key={i} style={{
              position: 'absolute', width: '24px', height: '24px',
              borderColor: '#c8a845', borderStyle: 'solid', ...style,
            }} />
          ))}

          {/* Content */}
          <div style={{
            position: 'absolute', inset: '30px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '11px', letterSpacing: '4px', color: '#1e3a5f',
              textTransform: 'uppercase', marginBottom: '20px',
              fontFamily: 'Arial, sans-serif',
            }}>
              Talentiv Learning Platform
            </div>

            <div style={{ fontSize: '34px', color: '#1e3a5f', marginBottom: '6px', fontWeight: 'normal' }}>
              Certificate of Completion
            </div>

            <div style={{
              fontSize: '10px', letterSpacing: '3px', color: '#888',
              textTransform: 'uppercase', marginBottom: '18px',
              fontFamily: 'Arial, sans-serif',
            }}>
              This is to certify that
            </div>

            <div style={{ width: '60px', height: '1px', background: '#c8a845', marginBottom: '18px' }} />

            <div style={{ fontSize: '40px', color: '#c8a845', fontStyle: 'italic', marginBottom: '16px' }}>
              {certificate.recipient_name}
            </div>

            <div style={{
              fontSize: '12px', color: '#444', lineHeight: '1.7',
              maxWidth: '480px', marginBottom: '10px',
              fontFamily: 'Arial, sans-serif',
            }}>
              has successfully completed the{' '}
              <strong>{certificate.course_title}</strong>{' '}
              program and demonstrated the required knowledge and skills.
            </div>

            {certificate.score != null && (
              <div style={{
                display: 'inline-block', fontSize: '11px', color: '#1e3a5f',
                border: '1px solid #1e3a5f', padding: '3px 12px', borderRadius: '20px',
                marginBottom: '24px', fontFamily: 'Arial, sans-serif', letterSpacing: '1px',
              }}>
                Final Score: {certificate.score}%
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            position: 'absolute', bottom: '34px', left: '52px', right: '52px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            fontFamily: 'Arial, sans-serif',
          }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '8px', color: '#aaa', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Issue Date
              </div>
              <div style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>{issuedDate}</div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <QRCodeSVG
                value={verifyUrl}
                size={64}
                bgColor="#ffffff"
                fgColor="#1e3a5f"
                level="M"
              />
              <div style={{ fontSize: '7px', color: '#bbb', fontFamily: 'Arial, sans-serif' }}>
                Scan to verify
              </div>
              <div style={{ fontSize: '7px', color: '#ccc', fontFamily: 'monospace' }}>
                {certificate.id.slice(0, 8)}…
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print stylesheet */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; background: white; }
          .no-print-pt { padding-top: 0 !important; min-height: unset; background: white; }
          .certificate-page { box-shadow: none !important; }
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>
    </>
  )
}
