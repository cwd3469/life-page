export const overlapGroupId = (prams: { parentGroupId?: string; groupId?: string }) => {
  const { parentGroupId, groupId } = prams;
  return parentGroupId ? `${parentGroupId}-${groupId}` : groupId;
};
