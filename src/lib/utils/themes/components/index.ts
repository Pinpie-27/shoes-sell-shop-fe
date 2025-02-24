import { Theme } from '@mui/material';

import { Button } from './Button';
import { IconButton } from './IconButton';
import { InputLabel } from './InputLabel';
import { ListItemButton } from './ListItemButton';
import { ListItemIcon } from './ListItemIcon';
import { OutlinedInput } from './OutlinedInput';

export const componentsOverrides = (theme: Theme) =>
    window._.merge(
        Button(),
        OutlinedInput(),
        InputLabel(),
        IconButton(theme),
        ListItemButton(theme),
        ListItemIcon(theme)
    );
