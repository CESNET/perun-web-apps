/**
 * Placeholder option stored in the embedded-groups CHECKBOX item definition when no
 * groups are configured. CHECKBOX definitions require at least one option
 * (server-side validation), so a newly added embedded item (or one from which all
 * groups were removed) keeps this placeholder. The server skips the placeholder in
 * option validation and on approval. Must stay in sync with the
 * EmbeddedGroups module constants in the registrar.
 */
export const EMBEDDED_OPTION_PLACEHOLDER_VALUE = '00000000-0000-0000-0000-000000000000';
export const EMBEDDED_OPTION_PLACEHOLDER_LABEL = 'No groups configured';

/**
 * Flow of the embedded group forms created for auto-registration targets. The legacy registrar
 * only performed the initial ("join") behavior for embedded groups, so only the
 * EMBEDDED_INITIAL flow is used.
 */
export const EMBEDDED_FLOW_ID = 'EMBEDDED_INITIAL';
