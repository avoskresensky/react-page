import { IconButton, Tooltip } from '@material-ui/core';
import Icon from '@material-ui/icons/FileCopy';
import React from 'react';
import { useDuplicateCell } from '../../core/components/hooks';

export const DuplicateButton: React.FC<{ nodeId: string }> = React.memo(
  ({ nodeId }) => {
    const duplicateCell = useDuplicateCell(nodeId);

    return (
      <Tooltip title="Duplicate Plugin">
        <IconButton onClick={duplicateCell} aria-label="delete" color="default">
          <Icon />
        </IconButton>
      </Tooltip>
    );
  }
);
