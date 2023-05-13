import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { ENV } from "../../config/config";

function TinyMCE(props) {
    return (
        <React.Fragment>
            <Editor
                apiKey='xen9rjkyskx8jyt74j4k55zpc31w3hth4f1jkquwb6a3iu5u'
                // initialValue={props.value}
                value={props.value}
                init={{
                    selector: 'textarea#open-source-plugins',
                    plugins: 'preview autolink save directionality code visualchars fullscreen image link media table anchor lists emoticons',
                    imagetools_cors_hosts: ['picsum.photos'],
                    menubar: 'file edit view insert format tools table help',
                    toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                    toolbar_sticky: true,
                    image_advtab: true,
                    importcss_append: true,
                    images_upload_url:ENV.url + 'content/upload',
                   
                    height: 600,
                    image_caption: true,
                    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                    noneditable_noneditable_class: 'mceNonEditable',
                    toolbar_mode: 'sliding',
                    contextmenu: 'link image imagetools table',
                    skin: 'oxide-dark',
                    content_css: 'dark',
                }}
                onEditorChange={(content) => props.onEditorChange(content)}
            />
        </React.Fragment>
    );
};

export default TinyMCE;