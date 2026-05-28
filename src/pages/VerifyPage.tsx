import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, XCircle, Award, Loader2, ExternalLink, Printer } from 'lucide-react'
import { useCertificate } from '../hooks/useCohortReview'
import { useAuth } from '../context/AuthContext'

export default function VerifyPage() {
  const { certId } = useParams<{ certId: string }>()
  const { certificate, loading, notFound } = useCertificate(certId)
  const { user } = useAuth()

  const isOwner = !!user && !!certificate && user.id === certificate.user_id

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-gray-600" />
      </div>
    )
  }

  if (notFound || !certificate) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <XCircle size={28} className="text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Certificate Not Found</h1>
          <p className="text-gray-500 text-sm">
            This certificate ID does not match any record in our system. It may have been revoked or the ID is incorrect.
          </p>
          <div className="mt-6 text-xs text-gray-700">ID: {certId}</div>
        </div>
      </div>
    )
  }

  const issuedDate = new Date(certificate.issued_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Verified badge */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
            <CheckCircle2 size={16} className="text-green-400" />
            <span className="text-sm font-semibold text-green-400">Verified Certificate</span>
          </div>
        </div>

        {/* Certificate card */}
        <div className="bg-[#0d1221] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-amber-500 via-primary-500 to-amber-500" />

          <div className="p-8 text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
              <Award size={28} className="text-amber-400" />
            </div>

            <div className="text-xs font-semibold tracking-[0.2em] text-gray-600 uppercase mb-3">
              Certificate of Completion
            </div>

            <div className="text-2xl font-bold text-white mb-1 font-serif italic">
              {certificate.recipient_name}
            </div>

            <div className="text-sm text-gray-500 mb-6">
              has successfully completed
            </div>

            <div className="text-lg font-semibold text-primary-300 mb-6 px-4">
              {certificate.course_title}
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-6 mb-8">
              {certificate.score != null && (
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">Final Score</div>
                  <div className={`text-lg font-bold ${
                    certificate.score >= 80 ? 'text-green-400' :
                    certificate.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {certificate.score}%
                  </div>
                </div>
              )}
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">Issue Date</div>
                <div className="text-sm text-gray-300 font-medium">{issuedDate}</div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/[0.06] mb-6" />

            {/* Certificate ID */}
            <div className="text-xs text-gray-700 mb-1">Certificate ID</div>
            <div className="font-mono text-xs text-gray-500 break-all mb-6">{certificate.id}</div>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              {isOwner && (
                <Link
                  to={`/certificate/${certificate.id}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                >
                  <Printer size={14} />
                  Print / Download PDF
                </Link>
              )}
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href)
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <ExternalLink size={14} />
                Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-700 mt-6">
          This certificate was issued by Talentiv Learning Platform.
          <br />
          Verify authenticity at this URL.
        </p>
      </div>
    </div>
  )
}
