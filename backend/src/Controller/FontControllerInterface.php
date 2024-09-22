<?php

namespace FontSystem\Controller;

interface FontControllerInterface {
    public function createFontGroup($groupName, $fontGroupData);
    public function getFontGroups();
    public function deleteFontGroup($groupId);
}
