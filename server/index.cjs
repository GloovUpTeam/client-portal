const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Ensure invoices directory exists
const invoicesDir = path.join(__dirname, 'invoices');
if (!fs.existsSync(invoicesDir)) {
  fs.mkdirSync(invoicesDir, { recursive: true });
}

// Create a dummy PDF if it doesn't exist
const samplePdfPath = path.join(invoicesDir, 'sample.pdf');
if (!fs.existsSync(samplePdfPath)) {
    const minimalPdf = `%PDF-1.0
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]/Parent 2 0 R/Resources<<>>>>endobj
xref
0 4
0000000000 65535 f
0000000010 00000 n
0000000060 00000 n
0000000117 00000 n
trailer<</Size 4/Root 1 0 R>>
startxref
199
%%EOF`;
    fs.writeFileSync(samplePdfPath, minimalPdf);
}

app.get('/api/invoices/:id/pdf', async (req, res) => {
  const id = req.params.id;
  console.log(`Received request for PDF of invoice ${id}`);
  
  try {
    // Validate invoice ID format
    if (!id || typeof id !== 'string') {
      console.error('Invalid invoice ID:', id);
      return res.status(400).json({ error: 'Invalid invoice ID' });
    }

    // Create a dummy PDF if it doesn't exist
    const samplePdfPath = path.join(invoicesDir, 'sample.pdf');
    
    // Ensure the file exists
    if (!fs.existsSync(samplePdfPath)) {
        // Re-create if missing
        const minimalPdf = `%PDF-1.0
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]/Parent 2 0 R/Resources<<>>>>endobj
xref
0 4
0000000000 65535 f
0000000010 00000 n
0000000060 00000 n
0000000117 00000 n
trailer<</Size 4/Root 1 0 R>>
startxref
199
%%EOF`;
        fs.writeFileSync(samplePdfPath, minimalPdf);
    }

    const fileBuffer = fs.readFileSync(samplePdfPath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${id}.pdf"`);
    res.send(fileBuffer);

  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// End of server file
