import { apiSlice } from "@/app/api/apiSlice";
import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

const saveVideoAdapter = createEntityAdapter({})
 
const initialState = saveVideoAdapter.getInitialState()

export const saveVideoApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getSavedVideo: builder.query({
            query: () => '/v1/video/get-saved-video',
            validateStatus: (response, result) => {
              return response.status === 200 && !result.isError;
            },
            transformResponse: (responseData) => {
                console.log({responseData})
              const loadedVideo = responseData.saveVideo.map(video => ({
                ...video,
                id: video._id
              }));
              return saveVideoAdapter.setAll(initialState, loadedVideo);
            },
            providesTags: (result, error, arg) => {
              if(result?.ids) {
                return [
                  { type: 'Save', id: 'List' },
                  ...result.ids.map(id => ({ type: 'Save', id }))
                ];
              } else {
                return [{ type: 'Save', id: 'List' }];
              }
            }
          }),
          saveNewVideo: builder.mutation({
           query: ({ id, userId }) => ({
          url: `/v1/video/save-video/${id}`,
            method: 'POST',
            body:{
              userId
            }
             }),
           invalidatesTags: [{ type: 'Save', id: 'List' }]
              }),
          deleteVideo: builder.mutation({
            query: ({id}) => ({
                url: '/video',
                method: 'DELETE',
                body: {
                    id
                }
            }),
            invalidatesTags: (result, error, arg) => [{type: 'Video', id:arg.id}]
          }),
        }),
        overrideExisting: true

})

export const {  
useGetSavedVideoQuery,
useDeleteVideoMutation,
useSaveNewVideoMutation
} = saveVideoApiSlice

// returns the query result object
export const selectVideoResult = saveVideoApiSlice.endpoints.getSavedVideo.select()

// creates memoized selector
const selectVideoData = createSelector(
selectVideoResult,
videoResult => videoResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
selectAll: selectSavedVideos,
selectById: selectSavedVideoById,
selectIds: selectSavedVideoIds
// Pass in a selector that returns the Videos slice of state
} = saveVideoAdapter.getSelectors(state => selectVideoData(state) ?? initialState)

