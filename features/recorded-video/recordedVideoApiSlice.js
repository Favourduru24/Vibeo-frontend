import { apiSlice } from "@/app/api/apiSlice";
import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

const recordAdapter = createEntityAdapter({})
 
const initialState = recordAdapter.getInitialState()

export const recordedVideoApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getRecord: builder.query({
            query: () => '/v1/video/get-screen-record',
            validateStatus: (response, result) => {
              return response.status === 200 && !result.isError;
            },
            transformResponse: (responseData) => {
                console.log({responseData})
              const loadedRecord = responseData.recordedVideo.map(record => ({
                ...record,
                id: record._id
              }));
              return recordAdapter.setAll(initialState, loadedRecord);
            },
            providesTags: (result, error, arg) => {
              if(result?.ids) {
                return [
                  { type: 'Record', id: 'List' },
                  ...result.ids.map(id => ({ type: 'Record', id }))
                ];
              } else {
                return [{ type: 'Record', id: 'List' }];
              }
            }
          }),
          addNewRecord: builder.mutation({
            query: initailRecordData => ({
                url: '/v1/video/upload-screen-record',
                method: 'POST',
                body: {
                    ...initailRecordData
                }
            }),
            invalidatesTags: [
                {type: 'Record', id: 'List'}
            ]
          }),
           getRecordedVideoById: builder.query({
            query: (id) => `/v1/video/get-screen-record/${id}`,
             validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
             },
            //  keepUnusedDataFor:5,
            transformResponse: responseData => {
                // Single feed response doesn't need .feed property
                return recordAdapter.setOne(initialState, {
                  ...responseData.recordedVideo,
                  id: responseData.recordedVideo._id
                });
              },
             providesTags: (result, error, arg) => {
                if(result?.ids){
             return [{type:'Record', id:'List'},
             ...result.ids.map(id => ({type: 'Record', id}))
            ]
                }else {
                    return [{type: 'Record', id: 'List'}]
                }
             }
        }),
        likeRecordedVideo: builder.mutation({
            query: ({ userId, id }) => ({
            url: `/v1/video/like-screen-record/${id}`,
            method: 'PATCH',
             body: { userId }
            }),
              invalidatesTags: (result, error, { id }) => [
                { type: 'Record', id },
                { type: 'Record', id: 'LIST' }
              ]
            }),
            saveScreenRecord: builder.mutation({
           query: ({ id, userId }) => ({
            url: `/v1/video/save-screen-record-video/${id}`,
            method: 'POST',
            body:{userId, id}
             }),
           invalidatesTags: [{ type: 'Save', id: 'List' }]
              }),
          unlikeRecordedVideo: builder.mutation({
            query: ({userId, id}) => ({
                url: `/v1/video/unlike-screen-record/${id}`,
                method:'PATCH',
                body: {userId}
            }),
            invalidatesTags: (result, error, { id }) => [
              { type: 'Record', id },
              { type: 'Record', id: 'LIST' }
            ]
          }),
          deleteRecord: builder.mutation({
            query: ({id}) => ({
                url: '/record',
                method: 'DELETE',
                body: {
                    id
                }
            }),
            invalidatesTags: (result, error, arg) => [{type: 'record', id:arg.id}]
          }),
        }),
        overrideExisting: true

})

export const {  
 useGetRecordQuery,
 useAddNewRecordMutation,
 useDeleteRecordMutation,
 useGetRecordedVideoByIdQuery,
 useLikeRecordedVideoMutation,
 useUnlikeRecordedVideoMutation,
 useSaveScreenRecordMutation,
} = recordedVideoApiSlice

// returns the query result object
export const selectRecordResult = recordedVideoApiSlice.endpoints.getRecord.select()

// creates memoized selector
const selectRecordData = createSelector(
selectRecordResult,
recordResult => recordResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
selectAll: selectAllRecords,
selectById: selectRecordById,
selectIds: selectRecordIds
// Pass in a selector that returns the feeds slice of state
} = recordAdapter.getSelectors(state => selectRecordData(state) ?? initialState)

