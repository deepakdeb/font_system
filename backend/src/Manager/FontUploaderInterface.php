<?php

namespace FontSystem\Manager;

interface FontUploaderInterface {
    public function upload($file): array;
}
