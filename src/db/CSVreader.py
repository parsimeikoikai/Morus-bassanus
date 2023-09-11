import csv
import logging

from langchain.document_loaders.csv_loader import CSVLoader
from langchain.docstore.document import Document

from ..logging import setup_logger

setup_logger()
logger = logging.getLogger(__name__)

class CSVCustomLoader(CSVLoader):
    """Load a `CSV` file into a list of Documents.

    Each document represents one row of the CSV file. Every row is converted into a
    key/value pair and outputted to a new line in the document's page_content.

    The source for each document loaded from csv is set to the value of the
    `file_path` argument for all documents by default.
    You can override this by setting the `source_column` argument to the
    name of a column in the CSV file.
    The source of each document will then be set to the value of the column
    with the name specified in `source_column`.

    Output Example:
        .. code-block:: txt

            column1: value1
            column2: value2
            column3: value3
    """
    def load(self, columns=[]):
        """Load data into document objects."""

        docs = []
        with open(self.file_path, newline="", encoding=self.encoding) as csvfile:
            csv_reader = csv.DictReader(csvfile, **self.csv_args)  # type: ignore
            for i, row in enumerate(csv_reader):
                content = "\n".join(f"{v.strip()}" for k, v in row.items() if k in columns)
                try:
                    source = (
                        row[self.source_column]
                        if self.source_column is not None
                        else self.file_path
                    )
                except KeyError:
                    raise ValueError(
                        f"Source column '{self.source_column}' not found in CSV file."
                    )
                metadata = {"source": source}
                doc = Document(page_content=content, metadata=metadata)
                docs.append(doc)
            csvfile.close()

        return docs
