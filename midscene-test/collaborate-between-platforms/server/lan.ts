import { networkInterfaces } from 'node:os';

export function publicHost(): string {
  if (process.env.SHOWCASE_LAN_HOST) {
    const host = process.env.SHOWCASE_LAN_HOST;
    if (!/^[a-zA-Z0-9.-]+$/.test(host))
      throw new Error(
        'SHOWCASE_LAN_HOST must be a hostname or IPv4 address without protocol/port.',
      );
    return host;
  }
  const entries = Object.entries(networkInterfaces()).sort(
    ([a], [b]) => Number(b === 'en0') - Number(a === 'en0'),
  );
  for (const [, addresses] of entries)
    for (const address of addresses || []) {
      // Include RFC 6598 shared-address networks used by some local simulator hosts.
      if (
        address.family === 'IPv4' &&
        !address.internal &&
        /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/.test(
          address.address,
        )
      )
        return address.address;
    }
  throw new Error(
    'No LAN IPv4 address found. Set SHOWCASE_LAN_HOST to an address reachable from your phones.',
  );
}
