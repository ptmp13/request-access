import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { decode as base64_decode, encode as base64_encode } from 'base-64';
import {
    EuiTitle,
    EuiButtonIcon,
    EuiScreenReaderOnly,
    RIGHT_ALIGNMENT,
    EuiFlexGroup,
    EuiFlexItem,
    EuiBasicTable,
    EuiLink,
    EuiPanel,
    useEuiTheme,
    EuiAvatar,
    EuiListGroup,
    EuiButton,
    EuiErrorBoundary,
} from '@elastic/eui';

import { css } from '@emotion/react';
import '@elastic/eui/dist/eui_theme_light.css';
//import response from 'http-browserify/lib/response';
import { render } from '@testing-library/react';
let base64 = require('base-64');


export default function Example() {
    const { euiTheme } = useEuiTheme();
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    let columns = [];
    const [scolumns, setColumns] = useState(columns);
    // const [selectedItems, setSelectedItems] = useState([]);
    const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({});
    // const tableRef = useRef();
    const [items, setSpaces] = useState([]);
    const [startupRoles, setStartupRoles] = useState([]);
    const [startupWaitRoles, setStartupWaitRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tableState, setTableState] = useState(true);
    const [buttonPrivsState, setButtonPrivsState] = useState(false);
    const [rolesState, setRolesState] = useState([]);
    const [time, setTime] = useState(Date.now());
    const [user, setUser] = useState('');
    var rolesSpaces = [];
    var rolesRequestedWaitSpaces = [];
    let loadErrors = false
    // For access buttons
    const [bIsLoading, setBIsLoading] = useState({});
    const [bStatus, setbStatus] = useState({});
    const [accessText, setAccessText] = useState({});
    const [iconType, setIconType] = useState({});
    //const [bexpandStatus, setBexpandStatus] = useState({});
    // let bStatus = true
    let bexpandStatus = true
    // let iconType = "lock"
    // let accessText = "Получить доступ"
    let color = "primary"

    // ELK Arrays
    // Main Kibana for get all Spaces
    //const primaryKibana = ["/prod"]
    //const primaryKibana = ["/forfun"]
    const primaryKibana = process.env.REACT_APP_PRIMARY_KIBANA
    const kibanaList = process.env.REACT_APP_KIBANALIST.split(", ");
    // Main elasticsearch for get and check current Roles
    //const primaryElastic = ["/elastic-forfun"]
    // list Kibana URLS for get index patterns
    //const kibanaList = ["/forfun", "/test"]
    // List elasticsearch for get grants
    //const elasticList = [ "/elasticsearch", "/elasticsearch-test" ]
    //const elasticList = ["/elastic-forfun"]
    //const elasticLogging = ["l-forfun"]

    const sleep = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    useEffect(() => {
        fetchSpaces();
        fetchUserRoles().then(
            () => fetchRequestedWaitRoles()
        )
        setTableState(false);
    }, []);

    async function fetchSpaces() {
        try {
            const response = await fetch(
                primaryKibana + "/su/api/spaces/space",
                {
                    method: 'GET',
                    mode: 'same-origin'
                }
            );
            const json = await response.json();
            //console.log(json);
            setSpaces(json)
        } catch (error) {
            console.log(error.message);
        }
    }

    async function getUser() {
        try {
            const response = await fetch(
                "/request-access/auth.shtml",
                {
                    method: 'GET',
                    mode: 'same-origin'
                }
            )
            const username = await response.text();
            setUser(username.toLowerCase())
            return username.toLowerCase()
        } catch (error) {
            console.log(error.message);
        }
    };

    async function fetchUserRoles() {
        try {
            const response = await fetch(
                primaryKibana + "/api/spaces/space",
                {
                    method: 'GET',
                    mode: 'same-origin'
                }
            );

            if (!response.ok) {
                setStartupRoles([]);
                console.log("no roles");
                throw new Error(`Error! status: ${response.status}`);
            }
            //console.log(response);
            const json = await response.json();
            //console.log(json);
            json.map((data) => rolesSpaces.push(data.id))
            // for(const i in json) {
            //     console.log(json[i].id)
            // }
            setStartupRoles(rolesSpaces);
            return startupRoles
        } catch (error) {
            console.log(error.message);
        }
    };

    async function fetchRequestedWaitRoles() {
        try {
            const user = await getUser();
            const response = await fetch(
                primaryKibana + "/el/grantlogging/_search",
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    },
                    mode: 'same-origin',
                    body: JSON.stringify({
                        "fields": [
                            "roles"
                        ],
                        "query": {
                            "bool": {
                                "must": [
                                    {
                                        "term": {
                                            "requeststatus": {
                                                "value": "created"
                                            }
                                        }
                                    },
                                    {
                                        "term": {
                                            "headers.user": {
                                                "value": user
                                            }
                                        }
                                    },
                                    {
                                        "term": {
                                            "waitaccept": true
                                        }
                                    }
                                ]
                            }
                        }
                    })
                }
            );

            if (!response.ok) {
                alert("Error!")
                throw new Error(`Error! status: ${response.status}`);
            }

            const json = await response.json();
            //console.log(json.hits.hits);
            json.hits.hits.map((data) => rolesRequestedWaitSpaces.push(data._source.roles))
            setStartupWaitRoles(rolesRequestedWaitSpaces);
            //console.log(rolesRequestedWaitSpaces);
            return rolesRequestedWaitSpaces
        } catch (error) {
            console.log(error.message);
        }
    };

    async function fetchIdx(space, env) {
        setIsLoading(true);
        //var URL=
        try {
            const response = await fetch(
                env + "/su/s/" + space + "/api/saved_objects/_find?type=index-pattern&per_page=10000",
                {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Basic '+REACT_APP_TOKEN
                    },
                    mode: 'same-origin'
                }
            );

            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }

            const result = await response.json();

            //console.log('result is: ', JSON.stringify(result, null, 4));
            //console.log(result);
            //setData(result);
            //console.log(data);
            return result.saved_objects
        } catch (err) {
            console.log(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    // async function getSpaceIdByName(name) {
    //     try {
    //         const response = await fetch(
    //             primaryKibana + "/su/api/spaces/space/" + name,
    //             {
    //                 method: 'GET',
    //                 mode: 'same-origin'
    //             }
    //         );
    //         const json = await response.json();
    //         //console.log(json);
    //         setSpaces(json)
    //     } catch (error) {
    //         console.log(error.message);
    //     }       
    // }

    async function setButtonTypes(item) {
        // console.log("========startupWaitRoles==========")
        // console.log(startupWaitRoles)
        // console.log("========startupRoles==========")
        // console.log(startupRoles)
        // console.log(item)
        if (item == "default" || item == "monitoring-metrics" || item == "weblogic-metrics") {
            bIsLoading[item] = false
            iconType[item] = "lock"
            bStatus[item] = true
            accessText[item] = "Not available"
        }
        else if (startupRoles.includes(item)) {
            bStatus[item] = true
            iconType[item] = "lockOpen"
            accessText[item] = "Available"
        }
        else if (startupWaitRoles.includes(item)) {
            bStatus[item] = true
            iconType[item] = "lockOpen"
            accessText[item] = "Waiting approve"
            bIsLoading[item] = true
        }
        else if (startupRoles.length > 10) {
            iconType[item] = "lock"
            bStatus[item] = true;
            accessText[item] = "Not available"
        }
        else {
            bStatus[item] = false
            iconType[item] = "accessibility"
            accessText[item] = "Request Access"
        }
    }

    async function getAccess(role) {
        // setTableState(true)
        var timestamp = Date.now();
        const bIsLoadingValues = { ...bIsLoading };
        bIsLoadingValues[role] = true;
        setBIsLoading(bIsLoadingValues);
        const user = await getUser();
        let additionalBody = "";
        for (let i in kibanaList) {
            additionalBody = additionalBody + '"kibana_' + kibanaList[i].substring(1, kibanaList[i].length) + '":"empty",';
        }
        let body = '{ \
            "user":"' + user + '",\
            "operation": "getAccess", \
            "roles":"' + role + '", \
            "timestamp":' + timestamp + ', \
            "requeststatus": "created", \
            "accepted":' + false + ', \
            ' + additionalBody + '"waitaccept":' + true + '}';
        //const resultRoles = await fetchUserRoles();
        //resultRoles.push(role);
        //var body=JSON.stringify({"roles": resultRoles})
        try {
            fetch(
                primaryKibana + "/ellog/ls/",
                {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    mode: 'same-origin',
                    body: body
                }
            )
            //.then((response) => console.log(response));
            // }

            await sleep(1000);
            fetchUserRoles().then(
                () => fetchRequestedWaitRoles()
            );
            bIsLoadingValues[role] = false;
            setBIsLoading(bIsLoadingValues);
        } catch (err) {
            console.log(err.message);
        }
    }

    columns = [
        {
            width: "50px",
            render: function (item) {
                return (
                    <EuiAvatar size="m" type="space" initialsLength={2} name={getInitials(item)} color={getColor(item)} />
                );
            }
        },
        {
            name: 'Space Name',
            sortable: true,
            truncateText: true,
            render: function (item) {
                let link=primaryKibana + "/s/" + item.id
                return (
                    <EuiLink href={link} target="_blank">
                        {item.name}
                    </EuiLink>
                );
            },
            mobileOptions: {
                show: true,
                header: false,
                truncateText: false,
                enlarge: true,
                width: '100%',
            },
        },
        {
            field: 'description',
            name: 'Description',
            truncateText: true,
            sortable: true,
            truncateText: true,
            mobileOptions: {
                show: false,
                width: '10px'
            },
        },
        {
            align: RIGHT_ALIGNMENT,
            header: 'Get Privs',
            render: function (item) {
                setButtonTypes(item.id)
                return (
                    <EuiButton
                        minWidth="170px"
                        onClick={() => getAccess(item.id)}
                        iconType={iconType[item.id]}
                        isDisabled={bStatus[item.id] ? true : false}
                        color={color}
                        fill={true}
                        isLoading={bIsLoading[item.id] ? true : false}
                    >
                        {accessText[item.id]}
                    </EuiButton>
                );
            }
        },
        {
            align: RIGHT_ALIGNMENT,
            width: '50px',
            isExpander: true,
            name: (
                <EuiScreenReaderOnly>
                    <span>Expand rows</span>
                </EuiScreenReaderOnly>
            ),
            render: function (item) {
                if (item.id == "default" || item.id == "monitoring-metrics" || item.id == "weblogic-metrics") {
                    bexpandStatus = true;
                }
                else {
                    bexpandStatus = false
                }
                return (
                    <EuiButtonIcon
                        onClick={() => toggleDetails(item)}
                        aria-label={itemIdToExpandedRowMap[item.id] ? 'Collapse' : 'Expand'}
                        iconType={itemIdToExpandedRowMap[item.id] ? 'arrowUp' : 'arrowDown'}
                        isDisabled={bexpandStatus}
                    />
                );
            },
        },
    ];

    function getInitials(i) {
        return ('' + i.initials + '');
    }

    function getColor(i) {
        return i.color;
    }

    const onTableChange = ({ page = {}, sort = {} }) => {
        const { index: pageIndex, size: pageSize } = page;

        const { field: sortField, direction: sortDirection } = sort;

        setPageIndex(pageIndex);
        setPageSize(pageSize);
        setSortField(sortField);
        setSortDirection(sortDirection);
    };

    const sorting = {
        sort: {
            field: sortField,
            direction: sortDirection,
        },
    };

    async function toggleDetails(item) {
        const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
        // console.log(itemIdToExpandedRowMapValues)
        if (itemIdToExpandedRowMapValues[item.id]) {
            delete itemIdToExpandedRowMapValues[item.id];
        } else {
            var ptrnList = [];
            for (var i in kibanaList) {
                const listIdxPattern = await fetchIdx(item.id, kibanaList[i]);
                ptrnList.push((function () {
                    return (
                        <EuiFlexItem>
                            <EuiTitle size="xxs">
                                <h5>{kibanaList[i]} index patterns:</h5>
                            </EuiTitle>
                            <EuiListGroup>
                                {listIdxPattern.map(idxptrn => (
                                    <li key={idxptrn.id}>{idxptrn.attributes.title}</li>
                                ))}
                            </EuiListGroup>
                        </EuiFlexItem>
                    )
                }()));
                itemIdToExpandedRowMapValues[item.id] = (function () {
                    return (
                        <EuiPanel paddingSize="m" hasBorder={true}>
                            <EuiFlexGroup>
                                {ptrnList}
                            </EuiFlexGroup>
                        </EuiPanel>
                    );
                }());
            }
        }
        setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
    }

    return (
        <div>
            <EuiBasicTable
                tableCaption="Spaces"
                items={items}
                columns={columns}
                // isSelectable={true}
                sorting={sorting}
                itemId="id"
                // selection={selection}
                onChange={onTableChange}
                hasActions={true}
                itemIdToExpandedRowMap={itemIdToExpandedRowMap}
                loading={tableState}
            />
        </div>
    );
}
