<script setup lang="ts">
	const receipts = await $fetch("/api/receipts", {
		method: "GET",
	});

	const receiptsFinal = ref<Record<string, any>>(receipts?.concat()!);

	for (const [index, receipt] of receipts!.entries()) {
		const allReceiptPositions = await $fetch(
			`/api/receipt_positions/receipts_id/${receipt.id}`,
		);

		receiptsFinal.value![index]!["items"] = allReceiptPositions;
	}
</script>

<template>
	<pre>
		{{ receiptsFinal }}
		<!-- {{ receipt_positions }}
		{{ allReceiptPositions }} -->
	</pre>
</template>
