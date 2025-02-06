
import CircularProgress from '@mui/material/CircularProgress';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';

export default function Loading({ isLoading = false }: { isLoading: boolean }) {
    return (
        <>
            <Dialog
                open={isLoading}
            >
                <DialogContent>
                    <CircularProgress size="3rem" />
                </DialogContent>
            </Dialog>
        </>
    )
}
