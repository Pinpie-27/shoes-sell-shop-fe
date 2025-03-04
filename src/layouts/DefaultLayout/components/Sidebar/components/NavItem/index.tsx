/* eslint-disable indent */
/* eslint-disable react/no-multi-comp */
import React from 'react';

import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Collapse, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import tw from 'twin.macro';

import { MenuItem } from '../../common';

interface NavItemProps {
    item: MenuItem;
    level: number;
    activeUrl: string;
}

export const NavItem: React.FC<NavItemProps> = ({ item, level, activeUrl = '' }) => {
    const defaultOpen = item.children?.length
        ? item.children?.map((item) => item.url || '').includes(activeUrl)
        : false;

    const [isOpen, setIsOpen] = React.useState<boolean>(defaultOpen);

    const handleOpen = () => !item?.disable && item.children && setIsOpen((pre) => !pre);

    const toggleIcon = () =>
        isOpen ? (
            <DownOutlined tw="ml-1 text-black text-[0.625rem]" css={[isOpen && tw`text-primary-main`]} />
        ) : (
            <UpOutlined tw="ml-1 text-black text-[0.625rem]" css={[isOpen && tw`text-primary-main`]} />
        );

    let listItemProps = {
        component: item.url
            ? React.forwardRef((props, _) => <Link {...props} to={item.url || '/'} />)
            : React.forwardRef((props, _) => <button tw="w-full" {...props} />),
    };

    const isSelect = activeUrl === item.url;

    return (
        <>
            <ListItemButton
                {...listItemProps}
                selected={isSelect}
                disabled={item?.disable}
                onClick={handleOpen}
                css={[
                    isSelect && tw`bg-divider! border-r-[2px]! border-primary-main! border-solid!`,
                    tw`py-2`,
                ]}
                sx={{
                    pl: `${level * 28}px`,
                }}
            >
                {item?.icon && (
                    <ListItemIcon
                        css={[
                            isSelect || isOpen
                                ? tw`text-primary-main!`
                                : tw`text-black!`,
                            tw`w-[36px] h-[36px]`,
                        ]}
                    >
                        {item?.icon}
                    </ListItemIcon>
                )}
                <ListItemText
                    primary={
                        <Typography
                            variant="h6"
                            css={[isOpen ? tw`text-black` : tw`text-black`]}
                        >
                            {item.title}
                        </Typography>
                    }
                />

                {item.children && toggleIcon()}
            </ListItemButton>
            {item?.children && (
                <Collapse
                    // sx={{
                    //     transformOrigin: '0 0 0',
                    // }}
                    in={isOpen}
                    timeout="auto"
                    unmountOnExit
                >
                    {item.children.map((item) => (
                        <NavItem
                            key={item.id}
                            item={item}
                            level={level + 1}
                            activeUrl={activeUrl}
                        />
                    ))}
                </Collapse>
            )}
        </>
    );
};
