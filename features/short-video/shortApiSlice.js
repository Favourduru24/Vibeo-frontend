import { apiSlice } from "@/app/api/apiSlice";
import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

const shortAdapter = createEntityAdapter({})
 
const initialState = shortAdapter.getInitialState()

export const shortApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getShort: builder.query({
            query: () => '/v1/video/get-shorts',
            validateStatus: (response, result) => {
              return response.status === 200 && !result.isError;
            },
            transformResponse: (responseData) => {
                console.log({responseData})
              const loadedShort = responseData.short.map(short => ({
                ...short,
                id: short._id
              }));
              return shortAdapter.setAll(initialState, loadedShort);
            },
            providesTags: (result, error, arg) => {
              if(result?.ids) {
                return [
                  { type: 'Short', id: 'List' },
                  ...result.ids.map(id => ({ type: 'Short', id }))
                ];
              } else {
                return [{ type: 'Short', id: 'List' }];
              }
            }
          }),
          addNewShort: builder.mutation({
            query: initailShortData => ({
                url: '/v1/video/upload-short',
                method: 'POST',
                body: {
                    ...initailShortData
                }
            }),
            invalidatesTags: [
                {type: 'Short', id: 'List'}
            ]
          }),
          deleteShort: builder.mutation({
            query: ({id}) => ({
                url: '/short',
                method: 'DELETE',
                body: {
                    id
                }
            }),
            invalidatesTags: (result, error, arg) => [{type: 'Short', id:arg.id}]
          }),
        }),
        overrideExisting: true

})

export const {  
 useGetShortQuery,
 useAddNewShortMutation,
 useDeleteShortMutation
} = shortApiSlice

// returns the query result object
export const selectShortResult = shortApiSlice.endpoints.getShort.select()

// creates memoized selector
const selectShortData = createSelector(
selectShortResult,
shortResult => shortResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
selectAll: selectAllShorts,
selectById: selectShortById,
selectIds: selectShortIds
// Pass in a selector that returns the feeds slice of state
} = shortAdapter.getSelectors(state => selectShortData(state) ?? initialState)

