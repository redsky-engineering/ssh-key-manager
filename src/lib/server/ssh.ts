import sshpk from 'sshpk';

export function isValidSshPublicKey(publicKeyWithComment: string): boolean {
	try {
		sshpk.parseKey(publicKeyWithComment);
		return true;
	} catch (_) {
		return false;
	}
}

export function getPublicKeyFingerprint(publicKeyWithComment: string): string {
	try {
		const key = sshpk.parseKey(publicKeyWithComment);
		return key.fingerprint().toString();
	} catch (_) {
		return '';
	}
}

export function getPublicKeyComment(publicKeyWithComment: string): string {
	try {
		const key = sshpk.parseKey(publicKeyWithComment);
		return key.comment || '';
	} catch (_) {
		return '';
	}
}
