'use client'
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRefreshMutation } from './authApiSlice';
import { selectCurrentToken } from './authSlice';
import usePersist from '@/hooks/usePersist';
import Link from 'next/link';
import Loader from '@/components/Loader'

const PersistLogin = ({ children }) => {
    const [persist] = usePersist();
    const token = useSelector(selectCurrentToken);
    const effectRan = useRef(false);

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation();

    useEffect(() => {
        if (effectRan.current === false) {
            const verifyRefreshToken = async () => {
                try {
                    await refresh();
                } catch (err) {
                    console.error(err);
                }
            };

            if (!token && persist) {
                verifyRefreshToken();
            }
        }

        return () => {
            effectRan.current = true;
        };
    }, [persist, refresh, token]);

    let content;
    if (!persist) {
        content = children;
    } else if (isLoading) {
        content = <div className="fixed inset-0 z-50 flex justify-center items-cente bg-black">
                    <Loader styleName='w-14 h-14'/>
                 </div>
    } else if (isError) {
        // content = (
        //     <div className='fixed inset-0 z-50 flex justify-center items-center bg-black text-white'>
        //         {`${error?.data?.message}`}
        //         <Link href="/sign-in" className="text-[#B391F0]">{' '}Please login again</Link>.
        //     </div>
        // );
        content = children;
    } else if (isSuccess || (token && isUninitialized)) {
        content = children;
    }

    return content;
};

export default PersistLogin;