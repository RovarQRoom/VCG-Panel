import * as XLSX from 'xlsx-js-style';
import moment from 'moment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function exportToExcel(data: any[], fileName = 'export') {
	// Format data by removing unwanted columns and formatting headers
	const excludedColumns = ['id', 'deleted_at', 'action'];
	const formattedData = data.map((item) => {
		const newItem = { ...item };
		excludedColumns.forEach((col) => delete newItem[col]);

		// Format the date if it exists
		if (newItem.created_at) {
			newItem.created_at = moment(newItem.created_at).format('DD/MM/YYYY HH:mm');
		}

		return newItem;
	});

	// Format headers with proper capitalization
	const formatHeader = (header: string) => {
		return header
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	};

	// Create workbook and worksheet
	const workbook = XLSX.utils.book_new();
	const worksheet = XLSX.utils.json_to_sheet(formattedData);

	// Custom column widths
	const columnWidths = {
		name: 20,
		email: 35,
		phone: 25,
		created_at: 30,
		traded_before: 25,
		knowledge: 25,
		monthly_income: 25,
		goal_income: 25,
		trade_priority: 25,
		trading_from: 35
	};

	// Apply column widths
	worksheet['!cols'] = Object.values(columnWidths).map((width) => ({ width }));

	// Format headers in the worksheet
	const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
	const headers = Object.keys(formattedData[0]);
	headers.forEach((header, idx) => {
		const cellRef = XLSX.utils.encode_cell({ r: 0, c: idx });
		worksheet[cellRef].v = formatHeader(header);
	});

	// Add row height for header
	worksheet['!rows'] = [{ hpt: 25 }]; // Set header row height to 25 points

	// Modern styling for headers
	const headerStyle = {
		fill: { fgColor: { rgb: '4F46E5' } }, // Modern indigo color
		font: { color: { rgb: 'FFFFFF' }, bold: true, sz: 12, name: 'Arial' },
		alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
		border: {
			top: { style: 'none' },
			bottom: { style: 'thin', color: { rgb: '6366F1' } }, // Subtle bottom border
			left: { style: 'none' },
			right: { style: 'none' }
		}
	};

	// Modern styling for data cells
	const cellStyle = {
		fill: { fgColor: { rgb: 'FFFFFF' } },
		font: { color: { rgb: '1F2937' }, sz: 11, name: 'Arial' }, // Darker text for better readability
		alignment: { horizontal: 'left', vertical: 'middle', wrapText: true },
		border: {
			top: { style: 'none' },
			bottom: { style: 'thin', color: { rgb: 'E5E7EB' } }, // Very light gray border
			left: { style: 'none' },
			right: { style: 'none' }
		}
	};

	// Add alternating row colors
	for (let row = range.s.r; row <= range.e.r; row++) {
		for (let col = range.s.c; col <= range.e.c; col++) {
			const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
			if (!worksheet[cellRef]) continue;

			if (row === 0) {
				worksheet[cellRef].s = headerStyle;
			} else {
				const rowStyle = { ...cellStyle };
				if (row % 2 === 0) {
					rowStyle.fill = { fgColor: { rgb: 'F9FAFB' } }; // Light gray for even rows
				}
				worksheet[cellRef].s = rowStyle;
			}
		}
	}

	// Add worksheet to workbook
	XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

	// Generate and download file
	const date = new Date().toISOString().split('T')[0];
	XLSX.writeFile(workbook, `${fileName}_${date}.xlsx`);
}
