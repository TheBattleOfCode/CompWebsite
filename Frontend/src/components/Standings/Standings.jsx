import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Container,
    Typography,
    Alert,
} from '@mui/material';
import React, { useState, useMemo } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { selectCurrentUser } from '../../features/auth/authSlice';
import { useGetUsersQuery, useGetCountriesQuery } from '../../services';

const Standings = () => {
    const currentUser = useSelector(selectCurrentUser);

    // RTK Query hooks
    const { data: users = [], isLoading: isLoadingUsers, error: usersError } = useGetUsersQuery();
    const { data: countries = [], isLoading: isLoadingCountries } = useGetCountriesQuery();

    // Local state
    const [sortField, setSortField] = useState('indivScore');
    const [sortDirection, setSortDirection] = useState('desc');
    const [selectedCountry, setSelectedCountry] = useState('All');

    // Sort countries alphabetically - keeping this for future use
    // eslint-disable-next-line no-unused-vars
    const sortedCountries = useMemo(() => {
        return [...(countries || [])].sort((a, b) => a.name?.common?.localeCompare(b.name?.common));
    }, [countries]);

    // Get unique countries from users
    const uniqueUserCountries = useMemo(() => {
        const countrySet = new Set();
        users.forEach((user) => {
            if (user.country) {
                countrySet.add(user.country);
            }
        });
        return Array.from(countrySet).sort();
    }, [users]);

    // Filter and sort users
    const filteredAndSortedUsers = useMemo(() => {
        // Filter by country if needed
        let filtered = [...users];
        if (selectedCountry !== 'All') {
            filtered = filtered.filter((user) => user.country === selectedCountry);
        }

        // Sort users
        return filtered.sort((a, b) => {
            const aValue = a[sortField] || 0;
            const bValue = b[sortField] || 0;

            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }, [users, selectedCountry, sortField, sortDirection]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const getSortIcon = (field) => {
        if (sortField !== field) {
            return <FaSort />;
        }
        return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
    };

    // Loading state
    if (isLoadingUsers || isLoadingCountries) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    // Error state
    if (usersError) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">
                    Error loading standings: {usersError.data?.message || usersError.error || 'Unknown error'}
                </Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Standings
            </Typography>

            {/* Country Filter */}
            <FormControl variant="outlined" sx={{ mb: 3, minWidth: 200 }}>
                <InputLabel id="country-filter-label">Filter by Country</InputLabel>
                <Select
                    labelId="country-filter-label"
                    id="country-filter"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    label="Filter by Country"
                >
                    <MenuItem value="All">All Countries</MenuItem>
                    {uniqueUserCountries.map((country) => (
                        <MenuItem key={country} value={country}>
                            {country}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Standings Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell onClick={() => handleSort('indivScore')} style={{ cursor: 'pointer' }}>
                                Score {getSortIcon('indivScore')}
                            </TableCell>
                            <TableCell onClick={() => handleSort('problemsSolved')} style={{ cursor: 'pointer' }}>
                                Problems Solved {getSortIcon('problemsSolved')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAndSortedUsers.map((user, index) => (
                            <TableRow
                                key={user._id}
                                sx={{
                                    backgroundColor:
                                        currentUser && user._id === currentUser.id
                                            ? 'rgba(25, 118, 210, 0.1)'
                                            : 'inherit',
                                }}
                            >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.country || '--'}</TableCell>
                                <TableCell>{user.indivScore || 0}</TableCell>
                                <TableCell>{user.problemsSolved || 0}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Standings;
