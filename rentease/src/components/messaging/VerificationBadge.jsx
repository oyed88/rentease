// Shows a verified badge on properties that have been verified on blockchain
export default function VerificationBadge({ txHash, size = 'md' }) {
  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  if (!txHash) {
    return (
      <span className={`inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 rounded-full font-body font-medium ${sizes[size]}`}>
        <span>○</span> Unverified
      </span>
    )
  }

  return (
    <a
      href={`https://mumbai.polygonscan.com/tx/${txHash}`}
      target="_blank"
      rel="noopener noreferrer"
      title="View on Polygon blockchain"
      className={`inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-full font-body font-medium hover:bg-blue-100 transition-colors ${sizes[size]}`}
    >
      <span>⬡</span> Blockchain Verified
    </a>
  )
}
