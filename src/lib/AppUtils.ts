export default class AppUtils {
	/**
	 * Gets the relative time (time ago) from a given date
	 * @param date
	 * @returns {string}
	 */
	static getRelativeTime(date: string): string {
		// 1-59 secs - Now
		// 1-59 mins - [#]m
		// 1-23 hours - [#]h
		// 1-7 days - [#]d
		// 1-52 weeks - [#]w
		// 1+ years - [#]y
		const time = new Date(date);
		const now = new Date();
		const diff = now.getTime() - time.getTime();
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);

		if (seconds < 60) return 'Now';
		if (minutes < 60) return `${minutes}m`;
		if (hours < 24) return `${hours}h`;
		if (hours < 168) return `${Math.floor(hours / 24)}d`;
		if (hours < 8760) return `${Math.floor(hours / 168)}w`;
		return `${Math.floor(hours / 8760)}y`;
	}

	/**
	 * Copy value to clipboard using web technologies
	 * @name copyToClipboardWeb
	 * @param {string} value
	 * @returns {void}
	 */
	static copyToClipboardWeb(value: string): void {
		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard.writeText(value).catch((err) => {
				console.error('Could not copy text: ', err);
			});
		} else {
			// Fallback method using the deprecated execCommand API
			const el = document.createElement('textarea');
			el.value = value;
			document.body.appendChild(el);
			el.select();
			try {
				document.execCommand('copy');
			} catch (err) {
				console.error('Could not copy text: ', err);
			}
			document.body.removeChild(el);
		}
	}
}
