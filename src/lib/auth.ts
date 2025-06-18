export function getTokenFromHeader(
  headers: Record<string, string | undefined>
) {
  const authHeader = headers["authorization"];
  console.log("Authorization header in getTokenFromHeader:", authHeader);
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "");
  }
  console.log("Токен не найден в заголовке, проверяем куки");
  return null;
}
