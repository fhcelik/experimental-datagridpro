import React, { memo, useState } from "react";
import { DataContainer, RowButton } from "./styled";
import {
  DataGridPremium,
  useGridApiContext,
  useGridSelector,
  gridFilteredDescendantCountLookupSelector,
  useGridApiRef,
  gridVisibleSortedRowIdsSelector,
} from "@mui/x-data-grid-premium";
import { columns, rows } from "./data";
import { LicenseInfo } from '@mui/x-license-pro';

export const isNavigationKey = (key) =>
  key === "Home" ||
  key === "End" ||
  key.indexOf("Arrow") === 0 ||
  key.indexOf("Page") === 0 ||
  key === " ";

  LicenseInfo.setLicenseKey('15928da418dd312d982f97e7569dbda7Tz01NDk4MCxFPTE3MDA5MzU0MjMwNDEsUz1wcmVtaXVtLExNPXN1YnNjcmlwdGlvbixLVj0y');
const CustomGridTreeDataGroupingCell = (props) => {
  const { id, field, rowNode } = props;

  const apiRef = useGridApiContext();
  const filteredDescendantCountLookup = useGridSelector(
    apiRef,
    gridFilteredDescendantCountLookupSelector
  );

  const filteredDescendantCount =
    filteredDescendantCountLookup[rowNode.id] ?? 0;

  const handleKeyDown = (event) => {
    if (event.key === " ") {
      event.stopPropagation();
    }
    if (isNavigationKey(event.key) && !event.shiftKey) {
      apiRef.current.publishEvent("cellNavigationKeyDown", props, event);
    }
  };

  const handleClick = (event) => {
    apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
    apiRef.current.setCellFocus(id, field);
    event.stopPropagation();
  };

  return (
    <div style={{ marginLeft: rowNode.depth * 24 }}>
      {filteredDescendantCount > 0 ? (
        <RowButton
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {!rowNode?.childrenExpanded ? <div /> : <div />}
          <span
            style={{
              color: "#000000",
              fontWeight: "bold",
              fontSize: 12,
              fontFamily: "Open Sans",
            }}
          >
            {rowNode?.groupingKey}
          </span>
        </RowButton>
      ) : (
        <RowButton>
          <span
            style={{
              color:
                rowNode?.groupingKey == "Portfolio Total"
                  ? "#000000"
                  : "#0000FF",
              fontWeight:
                rowNode?.groupingKey == "Portfolio Total" ? "bold" : "normal",
              fontSize: 12,
              whiteSpace: "initial",
              overflow: "initial",
              textDecoration:
                rowNode?.groupingKey == "Portfolio Total"
                  ? "none"
                  : "underline",
            }}
          >
            {rowNode?.groupingKey}
          </span>
        </RowButton>
      )}
    </div>
  );
};

export const CustomizableTable = memo((props) => {
  const { treeData = true, editable = false, height = 600 } = props;

  const apiRef = useGridApiRef();
  const [expandAll, setExpandAll] = useState(false);

  const handleClick = (e) => {
    const rowIds = gridVisibleSortedRowIdsSelector(apiRef);
    setExpandAll(!expandAll);
    if (rowIds.length > 1) {
      rowIds.map((rowId) =>
        apiRef.current.setRowChildrenExpansion(
          rowId,
          !apiRef.current.getRowNode(rowId)?.childrenExpanded
        )
      );
    }
  };

  const groupingColDef = {
    headerName: "Groups",
    width: 300,
    minWidth: 150,
    align: "left",
    sortable: false,
    headerClassName: "super-app-theme--header",
    cellClassName: "super-app-theme--cell-header",
    resizable: true,
    disableReorder: true,
    renderCell: (params) => <CustomGridTreeDataGroupingCell {...params} />,
    renderHeader: (params) => {
      return (
        <RowButton onClick={handleClick} tabIndex={-1}>
          {expandAll ? <div /> : <div />}
          <span
            style={{
              fontWeight: "bold",
              fontSize: 12,
              fontFamily: "Open Sans",
            }}
          >
            {params?.colDef?.headerName}
          </span>
        </RowButton>
      );
    },
  };

  return (
    <DataContainer customTable height={height}>
      {editable ? (
        <div />
      ) : (
        <DataGridPremium
          columns={columns}
          rows={rows}
          apiRef={apiRef}
          treeData={treeData}
          getTreeDataPath={treeData ? (row) => row.path : (row) => [row.name]}
          groupingColDef={groupingColDef}
          hideFooter
          sx={{
            "& .super-app-theme--header ": {
              color: "#000075",
              fontWeight: "700 !important",
              fontSize: 12,
              fontFamily: "Open Sans",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "700 !important",
            },
            "& .super-app-theme--header-blue": {
              backgroundColor: "#AEAEAE",
              color: "#0000A3",
              fontWeight: "700 !important",
              fontSize: 12,
              fontFamily: "Open Sans",
            },
            "& .super-app-theme--cell-header": {
              fontWeight: "bold",
              fontSize: 12,
              fontFamily: "Open Sans",
            },
            "& .super-app-theme--cell": {
              fontSize: 12,
              fontFamily: "Open Sans",
            },
            "& .super-app-theme--cell-value": {
              backgroundColor: "#AEAEAE",
              fontSize: 12,
              fontFamily: "Open Sans",
            },
          }}
        />
      )}
    </DataContainer>
  );
});

export default CustomizableTable;
