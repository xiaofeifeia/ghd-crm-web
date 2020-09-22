/* eslint-disable */
require('script-loader!file-saver');

export function export_blob_to_zip(content, zipName) {
  const blob = new Blob([content], {type: "application/zip;charset=utf-8"});
  console.log(blob)
  saveAs(blob, zipName)
}
