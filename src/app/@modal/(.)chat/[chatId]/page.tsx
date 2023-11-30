
import Chat from "@/app/chat/[chatId]/page";
import Modal from "@/app/_components/modal.component";

export default function ChatModal(props: { params: { chatId: string } }) {
    return (
        <Modal>
            <Chat {...props} />
        </Modal>
    );
}