/**
 * Message export configuration for LLM training
 */

/**
 * Message export cutoff date for LLM training
 * Messages older than this date will be excluded from exports
 * Set to null to include all messages
 */
export const MESSAGE_EXPORT_CUTOFF_DATE: Date | null = new Date(
    '2025-07-15T00:00:00.000Z'
)
