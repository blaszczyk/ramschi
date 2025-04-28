package com.github.blaszczyk.ramschi.ramschi_server.util;

import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Metadata;
import com.drew.metadata.MetadataException;
import com.drew.metadata.exif.ExifIFD0Directory;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.ImageEntity;
import org.imgscalr.Scalr;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import static org.imgscalr.Scalr.*;

@Component
public class ImageScaler {

    @Value("${image.thumbnail.height}")
    private int thumbnailHeight;

    @Value("${image.preview.width}")
    private int previewWidth;

    public void addThumbnailAndPreview(ImageEntity entity) {
        final BufferedImage image = getOrientedImage(entity);

        final int thumbnailWidth = thumbnailHeight * image.getWidth() / image.getHeight();
        final byte[] thumbnail = scale(image, thumbnailWidth, thumbnailHeight);
        entity.setThumbnail(thumbnail);

        final int previewHeight = previewWidth * image.getHeight() / image.getWidth();
        final byte[] preview = scale(image, previewWidth, previewHeight);
        entity.setPreview(preview);
    }   

    private byte[] scale(BufferedImage image, int width, int height) {
        final Image scaledImage = image.getScaledInstance(width, height, Image.SCALE_SMOOTH);
        final BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        bufferedImage.getGraphics().drawImage(scaledImage, 0, 0, null);
        try(final ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ImageIO.write(bufferedImage, "PNG", outputStream);
            return outputStream.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private BufferedImage getOrientedImage(ImageEntity entity) {
        try(final InputStream dataIS = new ByteArrayInputStream(entity.getOriginal())) {
            final BufferedImage badImage = ImageIO.read(dataIS);
            try(final InputStream metadataIS = new ByteArrayInputStream(entity.getOriginal())) {
                final Metadata metadata = ImageMetadataReader.readMetadata(metadataIS);
                final var exifIFDirectory = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);
                if (exifIFDirectory == null) {
                    return badImage;
                }
                final int orientation = exifIFDirectory.getInt(ExifIFD0Directory.TAG_ORIENTATION);
                return switch (orientation) {
                    case 1 -> badImage;
                    case 2 -> Scalr.rotate(badImage, Scalr.Rotation.FLIP_HORZ);
                    case 3 -> Scalr.rotate(badImage, Rotation.CW_180);
                    case 4 -> Scalr.rotate(badImage, Rotation.FLIP_VERT);
                    case 5 -> Scalr.rotate(Scalr.rotate(badImage, Rotation.CW_90), Rotation.FLIP_HORZ);
                    case 6 -> Scalr.rotate(badImage, Rotation.CW_90);
                    case 7 -> Scalr.rotate(Scalr.rotate(badImage, Rotation.CW_90), Rotation.FLIP_VERT);
                    case 8 -> Scalr.rotate(badImage, Rotation.CW_270);
                    default -> badImage;
                };
            } catch (ImageProcessingException | MetadataException e) {
                throw new RuntimeException(e);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
