function WebHookInfo() {
  return (
    <div className="space-y-2 text-xs text-gray-500">
      <p>
        <strong>How it works:</strong> When you favorite a TV show or movie, a webhook will be sent to the configured
        URL with the media details.
      </p>
      <p>
        <strong>Required format:</strong> The webhook sends a POST request with JSON body containing: query (title),
        type (tv/movie), tmdbId, and optional year.
      </p>
      <p>
        <strong>Example:</strong> POST /webhook/media with body:{' '}
        {JSON.stringify({ query: 'Breaking Bad', type: 'tv', tmdbId: 1396 })}
      </p>
    </div>
  );
}
export default WebHookInfo;
